import { IsOptional, IsEnum, IsDateString, IsBooleanString } from 'class-validator';
import { ExpenseCategory } from '../expense-category.enum';

export class FilterExpenseDto {
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsEnum(ExpenseCategory)
    category?: ExpenseCategory;

    @IsOptional()
    @IsBooleanString()
    isNecessary?: string;
}
