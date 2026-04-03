import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, BillingCycle } from './subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(Subscription)
        private readonly repo: Repository<Subscription>,
    ) {}

    findAll(userId: string) {
        return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    }

    async findOne(id: string, userId: string) {
        const sub = await this.repo.findOne({ where: { id, userId } });
        if (!sub) throw new NotFoundException('Subscription not found');
        return sub;
    }

    create(userId: string, dto: CreateSubscriptionDto) {
        const sub = this.repo.create({ ...dto, userId });
        return this.repo.save(sub);
    }

    async update(id: string, userId: string, dto: UpdateSubscriptionDto) {
        const sub = await this.findOne(id, userId);
        Object.assign(sub, dto);
        return this.repo.save(sub);
    }

    async remove(id: string, userId: string) {
        const sub = await this.findOne(id, userId);
        return this.repo.remove(sub);
    }

    async getAnalytics(userId: string) {
        const subs = await this.repo.find({ where: { userId, status: 'active' as any } });
        const monthlyTotal = subs.reduce((sum, s) => {
            const amt = Number(s.amount);
            if (s.billingCycle === BillingCycle.YEARLY) return sum + amt / 12;
            if (s.billingCycle === BillingCycle.WEEKLY) return sum + amt * 4.33;
            if (s.billingCycle === BillingCycle.QUARTERLY) return sum + amt / 3;
            return sum + amt;
        }, 0);

        return {
            totalActive: subs.length,
            monthlyTotal: Math.round(monthlyTotal * 100) / 100,
            yearlyTotal: Math.round(monthlyTotal * 12 * 100) / 100,
        };
    }
}
