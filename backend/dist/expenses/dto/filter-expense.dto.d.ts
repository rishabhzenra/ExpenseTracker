import { ExpenseCategory } from '../expense-category.enum';
export declare class FilterExpenseDto {
    startDate?: string;
    endDate?: string;
    category?: ExpenseCategory;
    isNecessary?: string;
}
