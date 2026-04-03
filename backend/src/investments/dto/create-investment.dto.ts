import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { InvestmentType } from '../investment.entity';

export class CreateInvestmentDto {
    @IsString()
    name: string;

    @IsEnum(InvestmentType)
    @IsOptional()
    type?: InvestmentType;

    @IsNumber()
    investedAmount: number;

    @IsNumber()
    @IsOptional()
    currentValue?: number;

    @IsString()
    @IsOptional()
    platform?: string;

    @IsString()
    @IsOptional()
    ticker?: string;

    @IsString()
    @IsOptional()
    purchaseDate?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
