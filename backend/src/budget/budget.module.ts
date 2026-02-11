import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './budget.entity';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { ExpensesModule } from '../expenses/expenses.module';

@Module({
    imports: [TypeOrmModule.forFeature([Budget]), ExpensesModule],
    controllers: [BudgetController],
    providers: [BudgetService],
})
export class BudgetModule { }
