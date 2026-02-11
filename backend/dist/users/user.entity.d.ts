import { Expense } from '../expenses/expense.entity';
import { Budget } from '../budget/budget.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    expenses: Expense[];
    budgets: Budget[];
}
