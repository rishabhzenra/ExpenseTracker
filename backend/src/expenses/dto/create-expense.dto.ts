import {
    IsEnum,
    IsNumber,
    IsBoolean,
    IsDateString,
    IsOptional,
    IsString,
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

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsString()
    merchant?: string;

    @IsOptional()
    @IsBoolean()
    isRecurring?: boolean;

    @IsOptional()
    @IsBoolean()
    isTaxDeductible?: boolean;
}
