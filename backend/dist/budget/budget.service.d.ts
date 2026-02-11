import { Repository } from 'typeorm';
import { Budget } from './budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { ExpensesService } from '../expenses/expenses.service';
export declare class BudgetService {
    private readonly budgetRepository;
    private readonly expensesService;
    constructor(budgetRepository: Repository<Budget>, expensesService: ExpensesService);
    getBudget(userId: string): Promise<{
        id: string | null;
        monthlyLimit: number;
        totalSpent: number;
        remaining: number;
        savings: number;
    }>;
    create(userId: string, dto: CreateBudgetDto): Promise<Budget>;
    update(userId: string, dto: UpdateBudgetDto): Promise<Budget>;
}
