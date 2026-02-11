import {
    IsEnum,
    IsNumber,
    IsBoolean,
    IsDateString,
    IsOptional,
    Min,
} from 'class-validator';
import { ExpenseCategory } from '../expense-category.enum';

export class CreateExpenseDto {
    @IsNumber()
    @Min(0.01)
    amount: number;

    @IsEnum(ExpenseCategory)
    category: ExpenseCategory;

    @IsBoolean()
    isNecessary: boolean;

    @IsDateString()
    date: string;
}
