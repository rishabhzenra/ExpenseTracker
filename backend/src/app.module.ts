import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { BudgetModule } from './budget/budget.module';
import { IncomeModule } from './income/income.module';
import { SavingsGoalsModule } from './savings-goals/savings-goals.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ClientsModule } from './clients/clients.module';
import { InvoicesModule } from './invoices/invoices.module';
import { TaxModule } from './tax/tax.module';
import { InvestmentsModule } from './investments/investments.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        return {
          type: 'postgres',
          url: databaseUrl,
          host: !databaseUrl ? configService.get('DB_HOST', 'localhost') : undefined,
          port: !databaseUrl ? configService.get<number>('DB_PORT', 5432) : undefined,
          username: !databaseUrl ? configService.get('DB_USERNAME', 'postgres') : undefined,
          password: !databaseUrl ? configService.get('DB_PASSWORD', 'postgres') : undefined,
          database: !databaseUrl ? configService.get('DB_NAME', 'expense_tracker') : undefined,
          autoLoadEntities: true,
          synchronize: configService.get('DB_SYNC') === 'true' || configService.get('NODE_ENV') !== 'production',
          ssl: databaseUrl ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    AuthModule,
    UsersModule,
    ExpensesModule,
    BudgetModule,
    IncomeModule,
    SavingsGoalsModule,
    SubscriptionsModule,
    ClientsModule,
    InvoicesModule,
    TaxModule,
    InvestmentsModule,
    SeedModule,
  ],
})
export class AppModule {}
