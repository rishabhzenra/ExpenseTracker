import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum ClientStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PROSPECT = 'prospect',
}

@Entity('clients')
export class Client {
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
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    company: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    industry: string;

    @Column({ type: 'enum', enum: ClientStatus, default: ClientStatus.ACTIVE })
    status: ClientStatus;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    totalBilled: number;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    totalPaid: number;

    @Column({ nullable: true, type: 'text' })
    notes: string;

    @Column({ nullable: true })
    taxId: string;

    @CreateDateColumn()
    createdAt: Date;
}
