import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    UseGuards,
    Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Controller('budget')
@UseGuards(JwtAuthGuard)
export class BudgetController {
    constructor(private readonly budgetService: BudgetService) { }

    @Get()
    getBudget(@Request() req: any) {
        return this.budgetService.getBudget(req.user.id);
    }

    @Post()
    create(@Request() req: any, @Body() dto: CreateBudgetDto) {
        return this.budgetService.create(req.user.id, dto);
    }

    @Patch()
    update(@Request() req: any, @Body() dto: UpdateBudgetDto) {
        return this.budgetService.update(req.user.id, dto);
    }
}
