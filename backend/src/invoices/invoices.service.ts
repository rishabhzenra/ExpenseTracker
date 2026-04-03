import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from './invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
    constructor(
        @InjectRepository(Invoice)
        private readonly repo: Repository<Invoice>,
    ) {}

    findAll(userId: string) {
        return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    }

    async findOne(id: string, userId: string) {
        const inv = await this.repo.findOne({ where: { id, userId } });
        if (!inv) throw new NotFoundException('Invoice not found');
        return inv;
    }

    async create(userId: string, dto: CreateInvoiceDto) {
        if (!dto.invoiceNumber) {
            const count = await this.repo.count({ where: { userId } });
            dto.invoiceNumber = `INV-${String(count + 1).padStart(4, '0')}`;
        }
        const inv = this.repo.create({ ...dto, userId, currency: dto.currency || 'INR' });
        return this.repo.save(inv);
    }

    async update(id: string, userId: string, dto: UpdateInvoiceDto) {
        const inv = await this.findOne(id, userId);
        Object.assign(inv, dto);
        return this.repo.save(inv);
    }

    async remove(id: string, userId: string) {
        const inv = await this.findOne(id, userId);
        return this.repo.remove(inv);
    }

    async getStats(userId: string) {
        const invoices = await this.repo.find({ where: { userId } });
        return {
            total: invoices.length,
            draft: invoices.filter(i => i.status === InvoiceStatus.DRAFT).length,
            sent: invoices.filter(i => i.status === InvoiceStatus.SENT).length,
            paid: invoices.filter(i => i.status === InvoiceStatus.PAID).length,
            overdue: invoices.filter(i => i.status === InvoiceStatus.OVERDUE).length,
            totalValue: invoices.reduce((s, i) => s + Number(i.total), 0),
            paidValue: invoices.filter(i => i.status === InvoiceStatus.PAID).reduce((s, i) => s + Number(i.total), 0),
            outstanding: invoices.filter(i => [InvoiceStatus.SENT, InvoiceStatus.OVERDUE].includes(i.status)).reduce((s, i) => s + Number(i.total), 0),
        };
    }
}
