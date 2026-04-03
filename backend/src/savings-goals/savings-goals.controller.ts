import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SavingsGoalsService } from './savings-goals.service';
import { CreateSavingsGoalDto } from './dto/create-savings-goal.dto';
import { UpdateSavingsGoalDto } from './dto/update-savings-goal.dto';

@Controller('savings-goals')
@UseGuards(JwtAuthGuard)
export class SavingsGoalsController {
    constructor(private readonly service: SavingsGoalsService) {}

    @Get()
    findAll(@Request() req: any) {
        return this.service.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.service.findOne(id, req.user.id);
    }

    @Post()
    create(@Request() req: any, @Body() dto: CreateSavingsGoalDto) {
        return this.service.create(req.user.id, dto);
    }

    @Patch(':id')
    update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateSavingsGoalDto) {
        return this.service.update(id, req.user.id, dto);
    }

    @Post(':id/deposit')
    deposit(@Request() req: any, @Param('id') id: string, @Body('amount') amount: number) {
        return this.service.deposit(id, req.user.id, amount);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) {
        return this.service.remove(id, req.user.id);
    }
}
