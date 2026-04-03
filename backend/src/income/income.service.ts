import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Income } from './income.entity';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Injectable()
export class IncomeService {
    constructor(
        @InjectRepository(Income)
        private readonly incomeRepository: Repository<Income>,
    ) {}

    async create(userId: string, dto: CreateIncomeDto): Promise<Income> {
        const income = this.incomeRepository.create({ ...dto, userId });
        return this.incomeRepository.save(income);
    }

    async findAll(userId: string, startDate?: string, endDate?: string, category?: string): Promise<Income[]> {
        const where: FindOptionsWhere<Income> = { userId };

        if (startDate && endDate) {
            where.date = Between(startDate, endDate);
        }

        if (category) {
            where.category = category as any;
        }

        return this.incomeRepository.find({
            where,
            order: { date: 'DESC', createdAt: 'DESC' },
        });
    }

    async findOne(id: string, userId: string): Promise<Income> {
        const income = await this.incomeRepository.findOne({ where: { id } });
        if (!income) throw new NotFoundException('Income not found');
        if (income.userId !== userId) throw new ForbiddenException('Access denied');
        return income;
    }

    async update(id: string, userId: string, dto: UpdateIncomeDto): Promise<Income> {
        const income = await this.findOne(id, userId);
        Object.assign(income, dto);
        return this.incomeRepository.save(income);
    }

    async remove(id: string, userId: string): Promise<void> {
        await this.findOne(id, userId);
        await this.incomeRepository.delete(id);
    }

    async getTotalInRange(userId: string, startDate: string, endDate: string): Promise<number> {
        const result = await this.incomeRepository
            .createQueryBuilder('income')
            .select('COALESCE(SUM(income.amount), 0)', 'total')
            .where('income.userId = :userId', { userId })
            .andWhere('income.date BETWEEN :startDate AND :endDate', { startDate, endDate })
            .getRawOne();
        return parseFloat(result.total);
    }

    async getAnalytics(userId: string) {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
        const yearStart = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];

        const [thisMonthTotal, lastMonthTotal] = await Promise.all([
            this.getTotalInRange(userId, monthStart, monthEnd),
            this.getTotalInRange(userId, lastMonthStart, lastMonthEnd),
        ]);

        const categoryBreakdown = await this.incomeRepository
            .createQueryBuilder('income')
            .select('income.category', 'category')
            .addSelect('COALESCE(SUM(income.amount), 0)', 'total')
            .where('income.userId = :userId', { userId })
            .andWhere('income.date BETWEEN :start AND :end', { start: monthStart, end: monthEnd })
            .groupBy('income.category')
            .getRawMany();

        const monthlyBreakdown = await this.incomeRepository
            .createQueryBuilder('income')
            .select("TO_CHAR(income.date::date, 'YYYY-MM')", 'month')
            .addSelect('COALESCE(SUM(income.amount), 0)', 'total')
            .where('income.userId = :userId', { userId })
            .andWhere('income.date >= :start', { start: yearStart })
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();

        const trend = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

        return {
            thisMonthTotal,
            lastMonthTotal,
            trend: Math.round(trend),
            categoryBreakdown: categoryBreakdown.map(c => ({ category: c.category, total: parseFloat(c.total) })),
            monthlyBreakdown: monthlyBreakdown.map(m => ({ month: m.month, total: parseFloat(m.total) })),
        };
    }
}
