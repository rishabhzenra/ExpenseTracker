import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FilterExpenseDto } from './dto/filter-expense.dto';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) { }

    @Post()
    create(@Request() req: any, @Body() dto: CreateExpenseDto) {
        return this.expensesService.create(req.user.id, dto);
    }

    @Get()
    findAll(@Request() req: any, @Query() filter: FilterExpenseDto) {
        return this.expensesService.findAll(req.user.id, filter);
    }

    @Get('analytics')
    getAnalytics(@Request() req: any) {
        return this.expensesService.getAnalytics(req.user.id);
    }

    @Patch(':id')
    update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() dto: UpdateExpenseDto,
    ) {
        return this.expensesService.update(id, req.user.id, dto);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) {
        return this.expensesService.remove(id, req.user.id);
    }
}
