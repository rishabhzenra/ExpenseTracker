import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('savings_goals')
export class SavingsGoal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    title: string;

    @Column('decimal', { precision: 10, scale: 2 })
    targetAmount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    currentAmount: number;

    @Column({ type: 'date', nullable: true })
    deadline: string;

    @CreateDateColumn()
    createdAt: Date;
}
