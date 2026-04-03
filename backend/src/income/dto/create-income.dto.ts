import { IsEnum, IsNumber, IsPositive, IsDateString, IsOptional, IsBoolean, IsString } from 'class-validator';
import { IncomeCategory } from '../income-category.enum';

export class CreateIncomeDto {
    @IsNumber()
    @IsPositive()
    amount: number;

    @IsEnum(IncomeCategory)
    category: IncomeCategory;

    @IsDateString()
    date: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsString()
    source?: string;

    @IsOptional()
    @IsBoolean()
    isRecurring?: boolean;
}
