import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxEntry, TaxStatus } from './tax-entry.entity';
import { CreateTaxEntryDto } from './dto/create-tax-entry.dto';
import { UpdateTaxEntryDto } from './dto/update-tax-entry.dto';

@Injectable()
export class TaxService {
    constructor(
        @InjectRepository(TaxEntry)
        private readonly repo: Repository<TaxEntry>,
    ) {}

    findAll(userId: string) {
        return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    }

    async findOne(id: string, userId: string) {
        const entry = await this.repo.findOne({ where: { id, userId } });
        if (!entry) throw new NotFoundException('Tax entry not found');
        return entry;
    }

    create(userId: string, dto: CreateTaxEntryDto) {
        const entry = this.repo.create({ ...dto, userId });
        return this.repo.save(entry);
    }

    async update(id: string, userId: string, dto: UpdateTaxEntryDto) {
        const entry = await this.findOne(id, userId);
        Object.assign(entry, dto);
        return this.repo.save(entry);
    }

    async remove(id: string, userId: string) {
        const entry = await this.findOne(id, userId);
        return this.repo.remove(entry);
    }

    async getSummary(userId: string) {
        const entries = await this.repo.find({ where: { userId } });
        return {
            total: entries.length,
            pending: entries.filter(e => e.status === TaxStatus.PENDING).length,
            paid: entries.filter(e => e.status === TaxStatus.PAID).length,
            overdue: entries.filter(e => e.status === TaxStatus.OVERDUE).length,
            totalLiability: entries.reduce((s, e) => s + Number(e.amount), 0),
            totalPaid: entries.filter(e => e.status === TaxStatus.PAID).reduce((s, e) => s + Number(e.amount), 0),
            pendingAmount: entries.filter(e => e.status !== TaxStatus.PAID && e.status !== TaxStatus.FILED).reduce((s, e) => s + Number(e.amount), 0),
        };
    }
}
