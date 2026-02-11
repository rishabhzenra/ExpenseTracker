import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { Expense } from '../expenses/expense.entity';
import { Budget } from '../budget/budget.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Expense, (expense) => expense.user)
    expenses: Expense[];

    @OneToMany(() => Budget, (budget) => budget.user)
    budgets: Budget[];
}
