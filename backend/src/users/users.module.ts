import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { SavingsGoal } from './savings-goal.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SavingsGoalController } from './savings-goal.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User, SavingsGoal])],
    controllers: [UsersController, SavingsGoalController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
