import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
    constructor(private readonly service: SubscriptionsService) {}

    @Get()
    findAll(@Request() req: any) { return this.service.findAll(req.user.id); }

    @Get('analytics')
    getAnalytics(@Request() req: any) { return this.service.getAnalytics(req.user.id); }

    @Get(':id')
    findOne(@Request() req: any, @Param('id') id: string) { return this.service.findOne(id, req.user.id); }

    @Post()
    create(@Request() req: any, @Body() dto: CreateSubscriptionDto) { return this.service.create(req.user.id, dto); }

    @Patch(':id')
    update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateSubscriptionDto) { return this.service.update(id, req.user.id, dto); }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) { return this.service.remove(id, req.user.id); }
}
