import { PartialType } from '@nestjs/mapped-types';
import { CreateTaxEntryDto } from './create-tax-entry.dto';

export class UpdateTaxEntryDto extends PartialType(CreateTaxEntryDto) {}
