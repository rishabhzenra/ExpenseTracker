import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
export declare class BudgetController {
    private readonly budgetService;
    constructor(budgetService: BudgetService);
    getBudget(req: any): Promise<{
        id: string | null;
        monthlyLimit: number;
        totalSpent: number;
        remaining: number;
        savings: number;
    }>;
    create(req: any, dto: CreateBudgetDto): Promise<import("./budget.entity").Budget>;
    update(req: any, dto: UpdateBudgetDto): Promise<import("./budget.entity").Budget>;
}
