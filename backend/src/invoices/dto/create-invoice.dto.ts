import { IsString, IsOptional, IsEnum, IsNumber, IsArray, Min } from 'class-validator';
import { InvoiceStatus } from '../invoice.entity';

export class CreateInvoiceDto {
    @IsString()
    @IsOptional()
    invoiceNumber?: string;

    @IsString()
    @IsOptional()
    clientId?: string;

    @IsString()
    @IsOptional()
    clientName?: string;

    @IsString()
    @IsOptional()
    clientEmail?: string;

    @IsString()
    @IsOptional()
    clientAddress?: string;

    @IsEnum(InvoiceStatus)
    @IsOptional()
    status?: InvoiceStatus;

    @IsString()
    issueDate: string;

    @IsString()
    @IsOptional()
    dueDate?: string;

    @IsArray()
    @IsOptional()
    items?: Array<{ description: string; quantity: number; rate: number; amount: number }>;

    @IsNumber()
    @Min(0)
    @IsOptional()
    subtotal?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    taxRate?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    taxAmount?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    total?: number;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    @IsOptional()
    currency?: string;

    @IsString()
    @IsOptional()
    paidDate?: string;
}
