import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from './investment.entity';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';

@Injectable()
export class InvestmentsService {
    constructor(
        @InjectRepository(Investment)
        private readonly repo: Repository<Investment>,
    ) {}

    findAll(userId: string) {
        return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    }

    async findOne(id: string, userId: string) {
        const inv = await this.repo.findOne({ where: { id, userId } });
        if (!inv) throw new NotFoundException('Investment not found');
        return inv;
    }

    create(userId: string, dto: CreateInvestmentDto) {
        const inv = this.repo.create({ ...dto, userId, currentValue: dto.currentValue ?? dto.investedAmount });
        return this.repo.save(inv);
    }

    async update(id: string, userId: string, dto: UpdateInvestmentDto) {
        const inv = await this.findOne(id, userId);
        Object.assign(inv, dto);
        return this.repo.save(inv);
    }

    async remove(id: string, userId: string) {
        const inv = await this.findOne(id, userId);
        return this.repo.remove(inv);
    }

    async getPortfolioSummary(userId: string) {
        const investments = await this.repo.find({ where: { userId, isActive: true } });
        const totalInvested = investments.reduce((s, i) => s + Number(i.investedAmount), 0);
        const totalCurrent = investments.reduce((s, i) => s + Number(i.currentValue), 0);
        const totalGain = totalCurrent - totalInvested;
        const gainPct = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

        const byType: Record<string, { invested: number; current: number; count: number }> = {};
        for (const inv of investments) {
            if (!byType[inv.type]) byType[inv.type] = { invested: 0, current: 0, count: 0 };
            byType[inv.type].invested += Number(inv.investedAmount);
            byType[inv.type].current += Number(inv.currentValue);
            byType[inv.type].count++;
        }

        return { totalInvested, totalCurrent, totalGain, gainPct, count: investments.length, byType };
    }
}
