import { IsNumber, Min } from 'class-validator';

export class UpdateBudgetDto {
    @IsNumber()
    @Min(0)
    monthlyLimit: number;
}
