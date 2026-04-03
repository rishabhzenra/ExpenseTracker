import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum TaxCategory {
    INCOME_TAX = 'income_tax',
    GST = 'gst',
    TDS = 'tds',
    ADVANCE_TAX = 'advance_tax',
    PROPERTY_TAX = 'property_tax',
    OTHER = 'other',
}

export enum TaxStatus {
    PENDING = 'pending',
    PAID = 'paid',
    OVERDUE = 'overdue',
    FILED = 'filed',
}

@Entity('tax_entries')
export class TaxEntry {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    title: string;

    @Column({ type: 'enum', enum: TaxCategory, default: TaxCategory.INCOME_TAX })
    category: TaxCategory;

    @Column({ type: 'enum', enum: TaxStatus, default: TaxStatus.PENDING })
    status: TaxStatus;

    @Column('decimal', { precision: 12, scale: 2 })
    amount: number;

    @Column({ type: 'date', nullable: true })
    dueDate: string;

    @Column({ type: 'date', nullable: true })
    paidDate: string;

    @Column({ nullable: true, type: 'text' })
    notes: string;

    @Column({ nullable: true })
    financialYear: string;

    @Column({ nullable: true })
    referenceNumber: string;

    @CreateDateColumn()
    createdAt: Date;
}
