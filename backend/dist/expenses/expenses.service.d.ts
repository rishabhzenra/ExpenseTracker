import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FilterExpenseDto } from './dto/filter-expense.dto';
export declare class ExpensesService {
    private readonly expensesRepository;
    constructor(expensesRepository: Repository<Expense>);
    create(userId: string, dto: CreateExpenseDto): Promise<Expense>;
    findAll(userId: string, filter: FilterExpenseDto): Promise<Expense[]>;
    findOne(id: string, userId: string): Promise<Expense>;
    update(id: string, userId: string, dto: UpdateExpenseDto): Promise<Expense>;
    remove(id: string, userId: string): Promise<void>;
    getSpentInRange(userId: string, startDate: string, endDate: string): Promise<number>;
    getAnalytics(userId: string): Promise<{
        spentToday: number;
        spentThisWeek: number;
        spentThisMonth: number;
        categoryBreakdown: {
            category: any;
            total: number;
        }[];
        necessaryBreakdown: {
            isNecessary: any;
            total: number;
        }[];
        dailyBreakdown: {
            date: any;
            total: number;
        }[];
        monthlyBreakdown: {
            month: any;
            total: number;
        }[];
    }>;
}
