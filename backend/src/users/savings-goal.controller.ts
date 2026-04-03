import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavingsGoal } from '../users/savings-goal.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('savings-goals')
@UseGuards(AuthGuard('jwt'))
export class SavingsGoalController {
    constructor(
        @InjectRepository(SavingsGoal)
        private readonly goalsRepository: Repository<SavingsGoal>,
    ) { }

    @Get()
    async findAll(@Request() req: any) {
        return this.goalsRepository.find({ where: { userId: req.user.id } });
    }

    @Post()
    async create(@Request() req: any, @Body() data: any) {
        const goal = this.goalsRepository.create({ ...data, userId: req.user.id });
        return this.goalsRepository.save(goal);
    }

    @Patch(':id')
    async update(@Request() req: any, @Param('id') id: string, @Body() data: any) {
        await this.goalsRepository.update({ id, userId: req.user.id }, data);
        return this.goalsRepository.findOne({ where: { id, userId: req.user.id } });
    }

    @Delete(':id')
    async remove(@Request() req: any, @Param('id') id: string) {
        return this.goalsRepository.delete({ id, userId: req.user.id });
    }
}
