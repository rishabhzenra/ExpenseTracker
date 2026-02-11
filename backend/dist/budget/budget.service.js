"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const budget_entity_1 = require("./budget.entity");
const expenses_service_1 = require("../expenses/expenses.service");
let BudgetService = class BudgetService {
    budgetRepository;
    expensesService;
    constructor(budgetRepository, expensesService) {
        this.budgetRepository = budgetRepository;
        this.expensesService = expensesService;
    }
    async getBudget(userId) {
        const budget = await this.budgetRepository.findOne({ where: { userId } });
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
            .toISOString()
            .split('T')[0];
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            .toISOString()
            .split('T')[0];
        const totalSpent = await this.expensesService.getSpentInRange(userId, monthStart, monthEnd);
        const monthlyLimit = budget ? Number(budget.monthlyLimit) : 0;
        const remaining = monthlyLimit - totalSpent;
        const savings = remaining > 0 ? remaining : 0;
        return {
            id: budget?.id ?? null,
            monthlyLimit,
            totalSpent,
            remaining,
            savings,
        };
    }
    async create(userId, dto) {
        const existing = await this.budgetRepository.findOne({ where: { userId } });
        if (existing) {
            existing.monthlyLimit = dto.monthlyLimit;
            return this.budgetRepository.save(existing);
        }
        const budget = this.budgetRepository.create({ ...dto, userId });
        return this.budgetRepository.save(budget);
    }
    async update(userId, dto) {
        const budget = await this.budgetRepository.findOne({ where: { userId } });
        if (!budget) {
            throw new common_1.NotFoundException('Budget not found. Create one first.');
        }
        budget.monthlyLimit = dto.monthlyLimit;
        return this.budgetRepository.save(budget);
    }
};
exports.BudgetService = BudgetService;
exports.BudgetService = BudgetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(budget_entity_1.Budget)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        expenses_service_1.ExpensesService])
], BudgetService);
//# sourceMappingURL=budget.service.js.map