import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { BillingCycle, SubscriptionStatus } from '../subscription.entity';

export class CreateSubscriptionDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    amount: number;

    @IsEnum(BillingCycle)
    @IsOptional()
    billingCycle?: BillingCycle;

    @IsEnum(SubscriptionStatus)
    @IsOptional()
    status?: SubscriptionStatus;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    logo?: string;

    @IsString()
    @IsOptional()
    nextBillingDate?: string;

    @IsString()
    @IsOptional()
    startDate?: string;

    @IsBoolean()
    @IsOptional()
    isTrial?: boolean;
}
