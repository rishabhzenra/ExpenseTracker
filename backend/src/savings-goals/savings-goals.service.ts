import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavingsGoal } from './savings-goal.entity';
import { CreateSavingsGoalDto } from './dto/create-savings-goal.dto';
import { UpdateSavingsGoalDto } from './dto/update-savings-goal.dto';

@Injectable()
export class SavingsGoalsService {
    constructor(
        @InjectRepository(SavingsGoal)
        private readonly repo: Repository<SavingsGoal>,
    ) {}

    findAll(userId: string) {
        return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    }

    async findOne(id: string, userId: string) {
        const goal = await this.repo.findOne({ where: { id, userId } });
        if (!goal) throw new NotFoundException('Goal not found');
        return goal;
    }

    create(userId: string, dto: CreateSavingsGoalDto) {
        const goal = this.repo.create({ ...dto, userId });
        return this.repo.save(goal);
    }

    async update(id: string, userId: string, dto: UpdateSavingsGoalDto) {
        const goal = await this.findOne(id, userId);
        Object.assign(goal, dto);
        return this.repo.save(goal);
    }

    async deposit(id: string, userId: string, amount: number) {
        const goal = await this.findOne(id, userId);
        goal.current = Number(goal.current) + amount;
        if (goal.current > goal.target) goal.current = goal.target;
        return this.repo.save(goal);
    }

    async remove(id: string, userId: string) {
        const goal = await this.findOne(id, userId);
        return this.repo.remove(goal);
    }
}
