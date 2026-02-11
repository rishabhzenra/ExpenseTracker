import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ExpenseCategory } from './expense-category.enum';

@Entity('expenses')
export class Expense {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, (user) => user.expenses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'enum', enum: ExpenseCategory })
    category: ExpenseCategory;

    @Column({ default: false })
    isNecessary: boolean;

    @Column({ type: 'date' })
    date: string;

    @CreateDateColumn()
    createdAt: Date;
}
