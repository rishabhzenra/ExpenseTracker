import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

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

    @Column({ name: 'targetAmount', type: 'decimal', precision: 12, scale: 2 })
    target: number;

    @Column({ name: 'currentAmount', type: 'decimal', precision: 12, scale: 2, default: 0 })
    current: number;

    @Column({ nullable: true, type: 'date' })
    deadline: string;

    @Column({ nullable: true })
    icon: string;

    @Column({ nullable: true })
    color: string;

    @CreateDateColumn()
    createdAt: Date;
}
