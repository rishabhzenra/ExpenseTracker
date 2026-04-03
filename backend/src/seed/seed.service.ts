import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../expenses/expense.entity';
import { ExpenseCategory } from '../expenses/expense-category.enum';
import { Income } from '../income/income.entity';
import { IncomeCategory } from '../income/income-category.enum';
import { SavingsGoal } from '../savings-goals/savings-goal.entity';
import { Subscription, BillingCycle, SubscriptionStatus } from '../subscriptions/subscription.entity';
import { Client, ClientStatus } from '../clients/client.entity';
import { Invoice, InvoiceStatus } from '../invoices/invoice.entity';
import { TaxEntry, TaxCategory, TaxStatus } from '../tax/tax-entry.entity';
import { Budget } from '../budget/budget.entity';
import { Investment, InvestmentType } from '../investments/investment.entity';

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(Expense) private expRepo: Repository<Expense>,
        @InjectRepository(Income) private incRepo: Repository<Income>,
        @InjectRepository(SavingsGoal) private goalRepo: Repository<SavingsGoal>,
        @InjectRepository(Subscription) private subRepo: Repository<Subscription>,
        @InjectRepository(Client) private clientRepo: Repository<Client>,
        @InjectRepository(Invoice) private invRepo: Repository<Invoice>,
        @InjectRepository(TaxEntry) private taxRepo: Repository<TaxEntry>,
        @InjectRepository(Budget) private budgetRepo: Repository<Budget>,
        @InjectRepository(Investment) private invstRepo: Repository<Investment>,
    ) {}

    async clearAll(userId: string) {
        await Promise.all([
            this.expRepo.delete({ userId }),
            this.incRepo.delete({ userId }),
            this.goalRepo.delete({ userId }),
            this.subRepo.delete({ userId }),
            this.clientRepo.delete({ userId }),
            this.invRepo.delete({ userId }),
            this.taxRepo.delete({ userId }),
            this.invstRepo.delete({ userId }),
        ]);
        return { message: 'All demo data cleared successfully' };
    }

    async seedAll(userId: string) {
        await this.clearAll(userId);

        // Budget
        const existing = await this.budgetRepo.findOne({ where: { userId } });
        if (!existing) {
            await this.budgetRepo.save(this.budgetRepo.create({ userId, monthlyLimit: 150000 }));
        } else {
            existing.monthlyLimit = 150000;
            await this.budgetRepo.save(existing);
        }

        // Expenses - 6 months of data
        const expenseData = [];
        const today = new Date();
        for (let m = 5; m >= 0; m--) {
            const month = new Date(today.getFullYear(), today.getMonth() - m, 1);
            const entries = [
                { amount: 12000, category: ExpenseCategory.BILLS, merchant: 'AWS Cloud Services', notes: 'Monthly server hosting', isRecurring: true, isTaxDeductible: true },
                { amount: 8500, category: ExpenseCategory.BILLS, merchant: 'Google Workspace', notes: 'Team collaboration tools', isRecurring: true, isTaxDeductible: true },
                { amount: 3200, category: ExpenseCategory.FOOD, merchant: 'Swiggy Corporate', notes: 'Team lunch', isRecurring: false, isTaxDeductible: false },
                { amount: 15000, category: ExpenseCategory.TRAVEL, merchant: 'IndiGo Airlines', notes: 'Client meeting Bangalore', isRecurring: false, isTaxDeductible: true },
                { amount: 4500, category: ExpenseCategory.SHOPPING, merchant: 'Amazon Business', notes: 'Office supplies', isRecurring: false, isTaxDeductible: true },
                { amount: 2000, category: ExpenseCategory.FUN, merchant: 'BookMyShow', notes: 'Team outing', isRecurring: false, isTaxDeductible: false },
                { amount: 6000, category: ExpenseCategory.BILLS, merchant: 'Jio Fiber', notes: 'Internet & phone', isRecurring: true, isTaxDeductible: true },
                { amount: 9800, category: ExpenseCategory.SHOPPING, merchant: 'Dell Technologies', notes: 'Peripherals', isRecurring: false, isTaxDeductible: true },
                { amount: 1800, category: ExpenseCategory.FOOD, merchant: 'Starbucks', notes: 'Client coffee meetings', isRecurring: false, isTaxDeductible: false },
                { amount: 5500, category: ExpenseCategory.OTHER, merchant: 'Nykaa Fashion', notes: 'Promotional merchandise', isRecurring: false, isTaxDeductible: true },
            ];
            for (let i = 0; i < entries.length; i++) {
                const day = Math.min(i * 2 + 1, 28);
                const date = new Date(month.getFullYear(), month.getMonth(), day);
                expenseData.push({ ...entries[i], userId, date: date.toISOString().split('T')[0], isNecessary: entries[i].isTaxDeductible });
            }
        }
        await this.expRepo.save(this.expRepo.create(expenseData as any));

        // Income - 6 months
        const incomeData = [];
        for (let m = 5; m >= 0; m--) {
            const month = new Date(today.getFullYear(), today.getMonth() - m, 1);
            const entries = [
                { amount: 180000, category: IncomeCategory.SALARY, source: 'Savora Technologies Pvt Ltd', notes: 'Monthly CTC', isRecurring: true },
                { amount: 45000, category: IncomeCategory.FREELANCE, source: 'TechCorp Global', notes: 'UI/UX consulting retainer', isRecurring: true },
                { amount: 12000, category: IncomeCategory.INVESTMENT, source: 'Zerodha Portfolio', notes: 'Equity dividend', isRecurring: false },
                { amount: 8000, category: IncomeCategory.OTHER, source: 'Udemy Course Sales', notes: 'Passive income from courses', isRecurring: false },
            ];
            for (let i = 0; i < entries.length; i++) {
                const day = [1, 5, 15, 20][i];
                const date = new Date(month.getFullYear(), month.getMonth(), day);
                incomeData.push({ ...entries[i], userId, date: date.toISOString().split('T')[0] });
            }
        }
        await this.incRepo.save(this.incRepo.create(incomeData as any));

        // Savings Goals
        await this.goalRepo.save(this.goalRepo.create([
            { userId, title: 'Emergency Fund', target: 500000, current: 320000, deadline: '2025-06-30', icon: 'shield', color: '#2563EB' },
            { userId, title: 'MacBook Pro M4', target: 250000, current: 187000, deadline: '2025-03-31', icon: 'laptop', color: '#7C3AED' },
            { userId, title: 'Europe Trip 2025', target: 350000, current: 95000, deadline: '2025-12-01', icon: 'plane', color: '#059669' },
            { userId, title: 'Down Payment – Apartment', target: 2000000, current: 450000, deadline: '2027-01-01', icon: 'home', color: '#DC2626' },
            { userId, title: 'Startup Capital', target: 1000000, current: 280000, deadline: '2026-04-01', icon: 'rocket', color: '#D97706' },
        ] as any));

        // Subscriptions
        await this.subRepo.save(this.subRepo.create([
            { userId, name: 'AWS', description: 'Cloud infrastructure', amount: 12000, billingCycle: BillingCycle.MONTHLY, status: SubscriptionStatus.ACTIVE, category: 'Infrastructure', nextBillingDate: this.nextMonth(), startDate: '2024-01-01' },
            { userId, name: 'GitHub Teams', description: 'Code collaboration', amount: 4200, billingCycle: BillingCycle.MONTHLY, status: SubscriptionStatus.ACTIVE, category: 'Development', nextBillingDate: this.nextMonth(), startDate: '2023-06-01' },
            { userId, name: 'Figma Professional', description: 'Design tool', amount: 3600, billingCycle: BillingCycle.MONTHLY, status: SubscriptionStatus.ACTIVE, category: 'Design', nextBillingDate: this.nextMonth(), startDate: '2023-08-01' },
            { userId, name: 'Notion Team', description: 'Project management', amount: 2400, billingCycle: BillingCycle.MONTHLY, status: SubscriptionStatus.ACTIVE, category: 'Productivity', nextBillingDate: this.nextMonth(), startDate: '2024-02-01' },
            { userId, name: 'Slack Pro', description: 'Team communication', amount: 6750, billingCycle: BillingCycle.MONTHLY, status: SubscriptionStatus.ACTIVE, category: 'Communication', nextBillingDate: this.nextMonth(), startDate: '2023-03-01' },
            { userId, name: 'Adobe Creative Cloud', description: 'Design suite', amount: 54000, billingCycle: BillingCycle.YEARLY, status: SubscriptionStatus.ACTIVE, category: 'Design', nextBillingDate: '2025-11-01', startDate: '2024-11-01' },
            { userId, name: 'Zoom Business', description: 'Video conferencing', amount: 1800, billingCycle: BillingCycle.MONTHLY, status: SubscriptionStatus.PAUSED, category: 'Communication', nextBillingDate: this.nextMonth(), startDate: '2023-09-01' },
            { userId, name: 'Linear', description: 'Issue tracking', amount: 3000, billingCycle: BillingCycle.MONTHLY, status: SubscriptionStatus.ACTIVE, category: 'Development', nextBillingDate: this.nextMonth(), startDate: '2024-03-01', isTrial: false },
        ] as any));

        // Clients
        const clients = await this.clientRepo.save(this.clientRepo.create([
            { userId, name: 'Arjun Mehta', email: 'arjun.mehta@techcorp.in', phone: '+91 98765 43210', company: 'TechCorp Global Pvt Ltd', address: 'Bandra Kurla Complex, Mumbai 400051', industry: 'Technology', status: ClientStatus.ACTIVE, totalBilled: 480000, totalPaid: 420000, notes: 'Long-term retainer client. Requires weekly check-ins.' },
            { userId, name: 'Priya Sharma', email: 'priya.s@nexus.co', phone: '+91 87654 32109', company: 'Nexus Innovations', address: 'Koramangala, Bangalore 560034', industry: 'SaaS', status: ClientStatus.ACTIVE, totalBilled: 320000, totalPaid: 320000, notes: 'Full payment always on time. Excellent relationship.' },
            { userId, name: 'Rohit Bansal', email: 'rohit@greenleaf.org', phone: '+91 76543 21098', company: 'GreenLeaf Ventures', address: 'Cyber City, Gurugram 122002', industry: 'Finance', status: ClientStatus.ACTIVE, totalBilled: 195000, totalPaid: 130000, notes: 'Partial payment. Follow up on remaining 65,000.' },
            { userId, name: 'Ananya Iyer', email: 'a.iyer@healthplus.com', phone: '+91 65432 10987', company: 'HealthPlus Systems', address: 'Jubilee Hills, Hyderabad 500033', industry: 'Healthcare', status: ClientStatus.INACTIVE, totalBilled: 85000, totalPaid: 85000, notes: 'Project completed. May return for maintenance.' },
            { userId, name: 'Vikram Singh', email: 'vikram@retailone.in', phone: '+91 54321 09876', company: 'RetailOne Corp', address: 'Connaught Place, New Delhi 110001', industry: 'Retail', status: ClientStatus.PROSPECT, totalBilled: 0, totalPaid: 0, notes: 'In negotiation. Proposal sent for ₹2L project.' },
        ] as any));

        // Invoices
        const clientMap = clients.reduce((m, c) => ({ ...m, [c.name]: c.id }), {} as Record<string, string>);
        await this.invRepo.save(this.invRepo.create([
            {
                userId, invoiceNumber: 'INV-0001', clientId: clientMap['Arjun Mehta'], clientName: 'Arjun Mehta', clientEmail: 'arjun.mehta@techcorp.in',
                clientAddress: 'Bandra Kurla Complex, Mumbai', status: InvoiceStatus.PAID, issueDate: '2025-01-15', dueDate: '2025-02-15', paidDate: '2025-02-10',
                items: [{ description: 'Full-Stack Development – Jan 2025', quantity: 1, rate: 120000, amount: 120000 }, { description: 'Deployment & DevOps Setup', quantity: 1, rate: 30000, amount: 30000 }],
                subtotal: 150000, taxRate: 18, taxAmount: 27000, total: 177000, currency: 'INR', notes: 'Thank you for your business!',
            },
            {
                userId, invoiceNumber: 'INV-0002', clientId: clientMap['Priya Sharma'], clientName: 'Priya Sharma', clientEmail: 'priya.s@nexus.co',
                clientAddress: 'Koramangala, Bangalore', status: InvoiceStatus.PAID, issueDate: '2025-02-01', dueDate: '2025-03-01', paidDate: '2025-02-28',
                items: [{ description: 'UI/UX Design – Dashboard Revamp', quantity: 1, rate: 80000, amount: 80000 }, { description: 'Prototype & Handoff', quantity: 1, rate: 20000, amount: 20000 }],
                subtotal: 100000, taxRate: 18, taxAmount: 18000, total: 118000, currency: 'INR', notes: '',
            },
            {
                userId, invoiceNumber: 'INV-0003', clientId: clientMap['Rohit Bansal'], clientName: 'Rohit Bansal', clientEmail: 'rohit@greenleaf.org',
                clientAddress: 'Cyber City, Gurugram', status: InvoiceStatus.OVERDUE, issueDate: '2025-02-15', dueDate: '2025-03-15',
                items: [{ description: 'Financial Dashboard Development', quantity: 1, rate: 95000, amount: 95000 }, { description: 'API Integration', quantity: 1, rate: 25000, amount: 25000 }],
                subtotal: 120000, taxRate: 18, taxAmount: 21600, total: 141600, currency: 'INR', notes: 'Payment overdue. Please clear at earliest.',
            },
            {
                userId, invoiceNumber: 'INV-0004', clientId: clientMap['Arjun Mehta'], clientName: 'Arjun Mehta', clientEmail: 'arjun.mehta@techcorp.in',
                clientAddress: 'Bandra Kurla Complex, Mumbai', status: InvoiceStatus.SENT, issueDate: '2025-03-01', dueDate: '2025-04-01',
                items: [{ description: 'Full-Stack Development – Mar 2025', quantity: 1, rate: 120000, amount: 120000 }, { description: 'Performance Optimization', quantity: 1, rate: 15000, amount: 15000 }],
                subtotal: 135000, taxRate: 18, taxAmount: 24300, total: 159300, currency: 'INR', notes: '',
            },
            {
                userId, invoiceNumber: 'INV-0005', clientId: clientMap['Ananya Iyer'], clientName: 'Ananya Iyer', clientEmail: 'a.iyer@healthplus.com',
                clientAddress: 'Jubilee Hills, Hyderabad', status: InvoiceStatus.DRAFT, issueDate: '2025-03-20', dueDate: '2025-04-20',
                items: [{ description: 'Healthcare Portal Maintenance', quantity: 3, rate: 15000, amount: 45000 }],
                subtotal: 45000, taxRate: 18, taxAmount: 8100, total: 53100, currency: 'INR', notes: 'Draft - pending client approval',
            },
        ] as any));

        // Tax Entries
        await this.taxRepo.save(this.taxRepo.create([
            { userId, title: 'Advance Tax – Q4 FY 2024-25', category: TaxCategory.ADVANCE_TAX, status: TaxStatus.PAID, amount: 42000, dueDate: '2025-03-15', paidDate: '2025-03-12', financialYear: 'FY 2024-25', referenceNumber: 'ADV-2025-001', notes: 'Paid via NSDL portal' },
            { userId, title: 'GST Return – February 2025', category: TaxCategory.GST, status: TaxStatus.FILED, amount: 68400, dueDate: '2025-03-20', paidDate: '2025-03-18', financialYear: 'FY 2024-25', referenceNumber: 'GSTR1-FEB25', notes: 'GSTR-1 & GSTR-3B filed' },
            { userId, title: 'TDS on Professional Fees', category: TaxCategory.TDS, status: TaxStatus.PAID, amount: 15000, dueDate: '2025-03-07', paidDate: '2025-03-05', financialYear: 'FY 2024-25', referenceNumber: 'TDS-Q3-2425', notes: 'TDS deducted by TechCorp Global' },
            { userId, title: 'Income Tax – Self Assessment', category: TaxCategory.INCOME_TAX, status: TaxStatus.PENDING, amount: 95000, dueDate: '2025-07-31', financialYear: 'FY 2024-25', referenceNumber: '', notes: 'Consult CA before filing' },
            { userId, title: 'GST Return – March 2025', category: TaxCategory.GST, status: TaxStatus.PENDING, amount: 72000, dueDate: '2025-04-20', financialYear: 'FY 2024-25', referenceNumber: '', notes: 'Prepare GSTR-1 data from invoices' },
            { userId, title: 'Property Tax – FY 2024-25', category: TaxCategory.PROPERTY_TAX, status: TaxStatus.OVERDUE, amount: 18500, dueDate: '2025-03-31', financialYear: 'FY 2024-25', referenceNumber: '', notes: 'Municipal corporation – late fee may apply' },
        ] as any));

        // Investments
        await this.invstRepo.save(this.invstRepo.create([
            { userId, name: 'Reliance Industries', type: InvestmentType.STOCKS, investedAmount: 150000, currentValue: 198500, platform: 'Zerodha', ticker: 'RELIANCE', purchaseDate: '2023-06-15', notes: 'Long-term hold' },
            { userId, name: 'HDFC Flexi Cap Fund', type: InvestmentType.MUTUAL_FUND, investedAmount: 240000, currentValue: 298000, platform: 'Groww', ticker: 'HDFCFLEXICAP', purchaseDate: '2022-10-01', notes: 'SIP ₹10,000/month' },
            { userId, name: 'Infosys Ltd', type: InvestmentType.STOCKS, investedAmount: 85000, currentValue: 79200, platform: 'Zerodha', ticker: 'INFY', purchaseDate: '2024-01-10', notes: 'IT sector bet' },
            { userId, name: 'Bitcoin', type: InvestmentType.CRYPTO, investedAmount: 100000, currentValue: 143000, platform: 'CoinDCX', ticker: 'BTC', purchaseDate: '2023-11-20', notes: 'High risk allocation' },
            { userId, name: 'SBI Fixed Deposit', type: InvestmentType.FIXED_DEPOSIT, investedAmount: 500000, currentValue: 534500, platform: 'SBI', ticker: null, purchaseDate: '2024-03-01', notes: '6.8% p.a. for 1 year' },
            { userId, name: 'Sovereign Gold Bond', type: InvestmentType.GOLD, investedAmount: 75000, currentValue: 89000, platform: 'HDFC Bank', ticker: 'SGB', purchaseDate: '2023-04-10', notes: '2.5% annual interest + gold returns' },
            { userId, name: 'Mirae Asset Large Cap', type: InvestmentType.MUTUAL_FUND, investedAmount: 180000, currentValue: 214000, platform: 'Kuvera', ticker: 'MIRAELARGE', purchaseDate: '2022-07-01', notes: 'Core portfolio' },
            { userId, name: 'PPF Account', type: InvestmentType.PPF, investedAmount: 150000, currentValue: 163500, platform: 'Post Office', ticker: null, purchaseDate: '2023-04-01', notes: '7.1% p.a. tax-free' },
        ] as any));

        return { message: 'Demo data seeded successfully! Your Savora dashboard is ready to present.' };
    }

    private nextMonth(): string {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d.toISOString().split('T')[0];
    }
}
