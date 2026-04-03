import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Controller('income')
@UseGuards(JwtAuthGuard)
export class IncomeController {
    constructor(private readonly incomeService: IncomeService) {}

    @Post()
    create(@Request() req: any, @Body() dto: CreateIncomeDto) {
        return this.incomeService.create(req.user.id, dto);
    }

    @Get()
    findAll(
        @Request() req: any,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('category') category?: string,
    ) {
        return this.incomeService.findAll(req.user.id, startDate, endDate, category);
    }

    @Get('analytics')
    getAnalytics(@Request() req: any) {
        return this.incomeService.getAnalytics(req.user.id);
    }

    @Get(':id')
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.incomeService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateIncomeDto) {
        return this.incomeService.update(id, req.user.id, dto);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) {
        return this.incomeService.remove(id, req.user.id);
    }
}
