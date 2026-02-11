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
exports.BudgetController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const budget_service_1 = require("./budget.service");
const create_budget_dto_1 = require("./dto/create-budget.dto");
const update_budget_dto_1 = require("./dto/update-budget.dto");
let BudgetController = class BudgetController {
    budgetService;
    constructor(budgetService) {
        this.budgetService = budgetService;
    }
    getBudget(req) {
        return this.budgetService.getBudget(req.user.id);
    }
    create(req, dto) {
        return this.budgetService.create(req.user.id, dto);
    }
    update(req, dto) {
        return this.budgetService.update(req.user.id, dto);
    }
};
exports.BudgetController = BudgetController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BudgetController.prototype, "getBudget", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_budget_dto_1.CreateBudgetDto]),
    __metadata("design:returntype", void 0)
], BudgetController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_budget_dto_1.UpdateBudgetDto]),
    __metadata("design:returntype", void 0)
], BudgetController.prototype, "update", null);
exports.BudgetController = BudgetController = __decorate([
    (0, common_1.Controller)('budget'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [budget_service_1.BudgetService])
], BudgetController);
//# sourceMappingURL=budget.controller.js.map