import { IsString, IsOptional, IsEnum, IsNumber, IsPositive } from 'class-validator';
import { TaxCategory, TaxStatus } from '../tax-entry.entity';

export class CreateTaxEntryDto {
    @IsString()
    title: string;

    @IsEnum(TaxCategory)
    @IsOptional()
    category?: TaxCategory;

    @IsEnum(TaxStatus)
    @IsOptional()
    status?: TaxStatus;

    @IsNumber()
    @IsPositive()
    amount: number;

    @IsString()
    @IsOptional()
    dueDate?: string;

    @IsString()
    @IsOptional()
    paidDate?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    @IsOptional()
    financialYear?: string;

    @IsString()
    @IsOptional()
    referenceNumber?: string;
}
