import { IsString, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class CreateSavingsGoalDto {
    @IsString()
    title: string;

    @IsNumber()
    @IsPositive()
    target: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    current?: number;

    @IsString()
    @IsOptional()
    deadline?: string;

    @IsString()
    @IsOptional()
    icon?: string;

    @IsString()
    @IsOptional()
    color?: string;
}
