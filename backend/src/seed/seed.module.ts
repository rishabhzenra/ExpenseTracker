import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { Expense } from '../expenses/expense.entity';
import { Income } from '../income/income.entity';
import { SavingsGoal } from '../savings-goals/savings-goal.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { Client } from '../clients/client.entity';
import { Invoice } from '../invoices/invoice.entity';
import { TaxEntry } from '../tax/tax-entry.entity';
import { Budget } from '../budget/budget.entity';
import { Investment } from '../investments/investment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Expense, Income, SavingsGoal, Subscription, Client, Invoice, TaxEntry, Budget, Investment]),
    ],
    controllers: [SeedController],
    providers: [SeedService],
})
export class SeedModule {}
