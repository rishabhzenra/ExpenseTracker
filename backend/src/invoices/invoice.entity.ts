import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum InvoiceStatus {
    DRAFT = 'draft',
    SENT = 'sent',
    PAID = 'paid',
    OVERDUE = 'overdue',
    CANCELLED = 'cancelled',
}

@Entity('invoices')
export class Invoice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ unique: false })
    invoiceNumber: string;

    @Column({ nullable: true })
    clientId: string;

    @Column({ nullable: true })
    clientName: string;

    @Column({ nullable: true })
    clientEmail: string;

    @Column({ nullable: true })
    clientAddress: string;

    @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
    status: InvoiceStatus;

    @Column({ type: 'date' })
    issueDate: string;

    @Column({ type: 'date', nullable: true })
    dueDate: string;

    @Column({ type: 'jsonb', nullable: true })
    items: Array<{ description: string; quantity: number; rate: number; amount: number }>;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    subtotal: number;

    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    taxRate: number;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    taxAmount: number;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    total: number;

    @Column({ nullable: true, type: 'text' })
    notes: string;

    @Column({ nullable: true })
    currency: string;

    @Column({ type: 'date', nullable: true })
    paidDate: string;

    @CreateDateColumn()
    createdAt: Date;
}
