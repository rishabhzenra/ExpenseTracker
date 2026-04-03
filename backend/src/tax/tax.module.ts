import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxEntry } from './tax-entry.entity';
import { TaxController } from './tax.controller';
import { TaxService } from './tax.service';

@Module({
    imports: [TypeOrmModule.forFeature([TaxEntry])],
    controllers: [TaxController],
    providers: [TaxService],
    exports: [TaxService],
})
export class TaxModule {}
