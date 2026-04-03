import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
    constructor(
        @InjectRepository(Client)
        private readonly repo: Repository<Client>,
    ) {}

    findAll(userId: string) {
        return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    }

    async findOne(id: string, userId: string) {
        const client = await this.repo.findOne({ where: { id, userId } });
        if (!client) throw new NotFoundException('Client not found');
        return client;
    }

    create(userId: string, dto: CreateClientDto) {
        const client = this.repo.create({ ...dto, userId });
        return this.repo.save(client);
    }

    async update(id: string, userId: string, dto: UpdateClientDto) {
        const client = await this.findOne(id, userId);
        Object.assign(client, dto);
        return this.repo.save(client);
    }

    async remove(id: string, userId: string) {
        const client = await this.findOne(id, userId);
        return this.repo.remove(client);
    }

    async getStats(userId: string) {
        const clients = await this.repo.find({ where: { userId } });
        return {
            total: clients.length,
            active: clients.filter(c => c.status === 'active' as any).length,
            totalBilled: clients.reduce((s, c) => s + Number(c.totalBilled), 0),
            totalPaid: clients.reduce((s, c) => s + Number(c.totalPaid), 0),
            outstanding: clients.reduce((s, c) => s + (Number(c.totalBilled) - Number(c.totalPaid)), 0),
        };
    }
}
