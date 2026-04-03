import { IsString, IsOptional, IsEnum, IsEmail, IsNumber } from 'class-validator';
import { ClientStatus } from '../client.entity';

export class CreateClientDto {
    @IsString()
    name: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    company?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    industry?: string;

    @IsEnum(ClientStatus)
    @IsOptional()
    status?: ClientStatus;

    @IsNumber()
    @IsOptional()
    totalBilled?: number;

    @IsNumber()
    @IsOptional()
    totalPaid?: number;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    @IsOptional()
    taxId?: string;
}
