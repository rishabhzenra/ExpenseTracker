import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
    constructor(private readonly service: ClientsService) {}

    @Get()
    findAll(@Request() req: any) { return this.service.findAll(req.user.id); }

    @Get('stats')
    getStats(@Request() req: any) { return this.service.getStats(req.user.id); }

    @Get(':id')
    findOne(@Request() req: any, @Param('id') id: string) { return this.service.findOne(id, req.user.id); }

    @Post()
    create(@Request() req: any, @Body() dto: CreateClientDto) { return this.service.create(req.user.id, dto); }

    @Patch(':id')
    update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateClientDto) { return this.service.update(id, req.user.id, dto); }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) { return this.service.remove(id, req.user.id); }
}
