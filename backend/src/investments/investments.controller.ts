import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';

@Controller('investments')
@UseGuards(JwtAuthGuard)
export class InvestmentsController {
    constructor(private readonly service: InvestmentsService) {}

    @Get() findAll(@Request() req: any) { return this.service.findAll(req.user.id); }
    @Get('summary') getSummary(@Request() req: any) { return this.service.getPortfolioSummary(req.user.id); }
    @Get(':id') findOne(@Request() req: any, @Param('id') id: string) { return this.service.findOne(id, req.user.id); }
    @Post() create(@Request() req: any, @Body() dto: CreateInvestmentDto) { return this.service.create(req.user.id, dto); }
    @Patch(':id') update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateInvestmentDto) { return this.service.update(id, req.user.id, dto); }
    @Delete(':id') remove(@Request() req: any, @Param('id') id: string) { return this.service.remove(id, req.user.id); }
}
