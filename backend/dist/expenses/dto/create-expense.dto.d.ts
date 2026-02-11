import { ExpenseCategory } from '../expense-category.enum';
export declare class CreateExpenseDto {
    amount: number;
    category: ExpenseCategory;
    isNecessary: boolean;
    date: string;
}
