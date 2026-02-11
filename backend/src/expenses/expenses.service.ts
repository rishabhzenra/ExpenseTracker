import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Expense } from './expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FilterExpenseDto } from './dto/filter-expense.dto';

@Injectable()
export class ExpensesService {
    constructor(
        @InjectRepository(Expense)
        private readonly expensesRepository: Repository<Expense>,
    ) { }

    async create(userId: string, dto: CreateExpenseDto): Promise<Expense> {
        const expense = this.expensesRepository.create({ ...dto, userId });
        return this.expensesRepository.save(expense);
    }

    async findAll(userId: string, filter: FilterExpenseDto): Promise<Expense[]> {
        const where: FindOptionsWhere<Expense> = { userId };

        if (filter.startDate && filter.endDate) {
            where.date = Between(filter.startDate, filter.endDate);
        }

        if (filter.category) {
            where.category = filter.category;
        }

        if (filter.isNecessary !== undefined) {
            where.isNecessary = filter.isNecessary === 'true';
        }

        return this.expensesRepository.find({
            where,
            order: { date: 'DESC', createdAt: 'DESC' },
        });
    }

    async findOne(id: string, userId: string): Promise<Expense> {
        const expense = await this.expensesRepository.findOne({ where: { id } });
        if (!expense) {
            throw new NotFoundException('Expense not found');
        }
        if (expense.userId !== userId) {
            throw new ForbiddenException('Access denied');
        }
        return expense;
    }

    async update(
        id: string,
        userId: string,
        dto: UpdateExpenseDto,
    ): Promise<Expense> {
        const expense = await this.findOne(id, userId);
        Object.assign(expense, dto);
        return this.expensesRepository.save(expense);
    }

    async remove(id: string, userId: string): Promise<void> {
        await this.findOne(id, userId);
        await this.expensesRepository.delete(id);
    }

    async getSpentInRange(
        userId: string,
        startDate: string,
        endDate: string,
    ): Promise<number> {
        const result = await this.expensesRepository
            .createQueryBuilder('expense')
            .select('COALESCE(SUM(expense.amount), 0)', 'total')
            .where('expense.userId = :userId', { userId })
            .andWhere('expense.date BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            })
            .getRawOne();
        return parseFloat(result.total);
    }

    async getAnalytics(userId: string) {
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        // Start of week (Monday)
        const dayOfWeek = now.getDay();
        const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - mondayOffset);
        const weekStartStr = weekStart.toISOString().split('T')[0];

        // Start of month
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
            .toISOString()
            .split('T')[0];
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            .toISOString()
            .split('T')[0];

        const [spentToday, spentThisWeek, spentThisMonth] = await Promise.all([
            this.getSpentInRange(userId, today, today),
            this.getSpentInRange(userId, weekStartStr, today),
            this.getSpentInRange(userId, monthStart, monthEnd),
        ]);

        // Category breakdown for current month
        const categoryBreakdown = await this.expensesRepository
            .createQueryBuilder('expense')
            .select('expense.category', 'category')
            .addSelect('COALESCE(SUM(expense.amount), 0)', 'total')
            .where('expense.userId = :userId', { userId })
            .andWhere('expense.date BETWEEN :start AND :end', {
                start: monthStart,
                end: monthEnd,
            })
            .groupBy('expense.category')
            .getRawMany();

        // Necessary vs Unnecessary for current month
        const necessaryBreakdown = await this.expensesRepository
            .createQueryBuilder('expense')
            .select('expense.isNecessary', 'isNecessary')
            .addSelect('COALESCE(SUM(expense.amount), 0)', 'total')
            .where('expense.userId = :userId', { userId })
            .andWhere('expense.date BETWEEN :start AND :end', {
                start: monthStart,
                end: monthEnd,
            })
            .groupBy('expense.isNecessary')
            .getRawMany();

        // Daily breakdown for current week
        const dailyBreakdown = await this.expensesRepository
            .createQueryBuilder('expense')
            .select('expense.date', 'date')
            .addSelect('COALESCE(SUM(expense.amount), 0)', 'total')
            .where('expense.userId = :userId', { userId })
            .andWhere('expense.date BETWEEN :start AND :end', {
                start: weekStartStr,
                end: today,
            })
            .groupBy('expense.date')
            .orderBy('expense.date', 'ASC')
            .getRawMany();

        // Monthly breakdown for current year
        const yearStart = new Date(now.getFullYear(), 0, 1)
            .toISOString()
            .split('T')[0];
        const monthlyBreakdown = await this.expensesRepository
            .createQueryBuilder('expense')
            .select("TO_CHAR(expense.date::date, 'YYYY-MM')", 'month')
            .addSelect('COALESCE(SUM(expense.amount), 0)', 'total')
            .where('expense.userId = :userId', { userId })
            .andWhere('expense.date >= :start', { start: yearStart })
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();

        return {
            spentToday,
            spentThisWeek,
            spentThisMonth,
            categoryBreakdown: categoryBreakdown.map((c) => ({
                category: c.category,
                total: parseFloat(c.total),
            })),
            necessaryBreakdown: necessaryBreakdown.map((n) => ({
                isNecessary: n.isNecessary,
                total: parseFloat(n.total),
            })),
            dailyBreakdown: dailyBreakdown.map((d) => ({
                date: d.date,
                total: parseFloat(d.total),
            })),
            monthlyBreakdown: monthlyBreakdown.map((m) => ({
                month: m.month,
                total: parseFloat(m.total),
            })),
        };
    }
}
