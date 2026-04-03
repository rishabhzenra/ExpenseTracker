import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum BillingCycle {
    MONTHLY = 'monthly',
    YEARLY = 'yearly',
    WEEKLY = 'weekly',
    QUARTERLY = 'quarterly',
}

export enum SubscriptionStatus {
    ACTIVE = 'active',
    PAUSED = 'paused',
    CANCELLED = 'cancelled',
}

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'enum', enum: BillingCycle, default: BillingCycle.MONTHLY })
    billingCycle: BillingCycle;

    @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.ACTIVE })
    status: SubscriptionStatus;

    @Column({ nullable: true })
    category: string;

    @Column({ nullable: true })
    logo: string;

    @Column({ type: 'date', nullable: true })
    nextBillingDate: string;

    @Column({ type: 'date', nullable: true })
    startDate: string;

    @Column({ default: false })
    isTrial: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
