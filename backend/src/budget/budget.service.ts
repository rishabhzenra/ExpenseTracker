import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { ExpensesService } from '../expenses/expenses.service';

@Injectable()
export class BudgetService {
    constructor(
        @InjectRepository(Budget)
        private readonly budgetRepository: Repository<Budget>,
        private readonly expensesService: ExpensesService,
    ) { }

    async getBudget(userId: string) {
        const budget = await this.budgetRepository.findOne({ where: { userId } });

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
            .toISOString()
            .split('T')[0];
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            .toISOString()
            .split('T')[0];

        const totalSpent = await this.expensesService.getSpentInRange(
            userId,
            monthStart,
            monthEnd,
        );

        const monthlyLimit = budget ? Number(budget.monthlyLimit) : 0;
        const remaining = monthlyLimit - totalSpent;
        const savings = remaining > 0 ? remaining : 0;

        return {
            id: budget?.id ?? null,
            monthlyLimit,
            totalSpent,
            remaining,
            savings,
        };
    }

    async create(userId: string, dto: CreateBudgetDto): Promise<Budget> {
        const existing = await this.budgetRepository.findOne({ where: { userId } });
        if (existing) {
            existing.monthlyLimit = dto.monthlyLimit;
            return this.budgetRepository.save(existing);
        }
        const budget = this.budgetRepository.create({ ...dto, userId });
        return this.budgetRepository.save(budget);
    }

    async update(userId: string, dto: UpdateBudgetDto): Promise<Budget> {
        const budget = await this.budgetRepository.findOne({ where: { userId } });
        if (!budget) {
            throw new NotFoundException('Budget not found. Create one first.');
        }
        budget.monthlyLimit = dto.monthlyLimit;
        return this.budgetRepository.save(budget);
    }
}
