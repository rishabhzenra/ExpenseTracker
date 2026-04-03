import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum InvestmentType {
    STOCKS = 'stocks',
    MUTUAL_FUND = 'mutual_fund',
    FIXED_DEPOSIT = 'fixed_deposit',
    CRYPTO = 'crypto',
    GOLD = 'gold',
    REAL_ESTATE = 'real_estate',
    BONDS = 'bonds',
    PPF = 'ppf',
    OTHER = 'other',
}

@Entity('investments')
export class Investment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: InvestmentType, default: InvestmentType.STOCKS })
    type: InvestmentType;

    @Column('decimal', { precision: 14, scale: 2 })
    investedAmount: number;

    @Column('decimal', { precision: 14, scale: 2, default: 0 })
    currentValue: number;

    @Column({ nullable: true })
    platform: string;

    @Column({ nullable: true })
    ticker: string;

    @Column({ nullable: true, type: 'date' })
    purchaseDate: string;

    @Column({ nullable: true, type: 'text' })
    notes: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
