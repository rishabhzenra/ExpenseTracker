import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { IncomeCategory } from './income-category.enum';

@Entity('incomes')
export class Income {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'enum', enum: IncomeCategory })
    category: IncomeCategory;

    @Column({ nullable: true, type: 'text' })
    notes: string;

    @Column({ nullable: true })
    source: string;

    @Column({ default: false })
    isRecurring: boolean;

    @Column({ type: 'date' })
    date: string;

    @CreateDateColumn()
    createdAt: Date;
}
