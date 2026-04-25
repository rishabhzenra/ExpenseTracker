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
            await this.budgetRepo.save(this.budgetRepo.create({ userId, monthlyLimit: 200000 }));
        } else {
            existing.monthlyLimit = 200000;
            await this.budgetRepo.save(existing);
        }

        // Expenses — 12 months, 20 entries per month
        const expenseData: any[] = [];
        const today = new Date();
        const monthlyExpenseTemplates = [
            { amount: 12000, category: ExpenseCategory.BILLS, merchant: 'AWS Cloud Services', notes: 'Monthly server hosting', isRecurring: true, isTaxDeductible: true },
            { amount: 8500, category: ExpenseCategory.BILLS, merchant: 'Google Workspace', notes: 'Team collaboration tools', isRecurring: true, isTaxDeductible: true },
            { amount: 6000, category: ExpenseCategory.BILLS, merchant: 'Jio Fiber', notes: 'Broadband & phone', isRecurring: true, isTaxDeductible: true },
            { amount: 4200, category: ExpenseCategory.BILLS, merchant: 'GitHub Teams', notes: 'Code repository', isRecurring: true, isTaxDeductible: true },
            { amount: 3600, category: ExpenseCategory.BILLS, merchant: 'Figma Professional', notes: 'Design tool license', isRecurring: true, isTaxDeductible: true },
            { amount: 2400, category: ExpenseCategory.BILLS, merchant: 'Notion Team', notes: 'Project management', isRecurring: true, isTaxDeductible: true },
            { amount: 6750, category: ExpenseCategory.BILLS, merchant: 'Slack Pro', notes: 'Team communication', isRecurring: true, isTaxDeductible: true },
            { amount: 3000, category: ExpenseCategory.BILLS, merchant: 'Linear', notes: 'Issue tracking', isRecurring: true, isTaxDeductible: true },
            { amount: 3200, category: ExpenseCategory.FOOD, merchant: 'Swiggy Corporate', notes: 'Team lunch', isRecurring: false, isTaxDeductible: false },
            { amount: 1800, category: ExpenseCategory.FOOD, merchant: 'Starbucks', notes: 'Client coffee meetings', isRecurring: false, isTaxDeductible: false },
            { amount: 2500, category: ExpenseCategory.FOOD, merchant: 'Zomato', notes: 'Working late dinner', isRecurring: false, isTaxDeductible: false },
            { amount: 1200, category: ExpenseCategory.FOOD, merchant: 'Barbeque Nation', notes: 'Team celebration', isRecurring: false, isTaxDeductible: false },
            { amount: 15000, category: ExpenseCategory.TRAVEL, merchant: 'IndiGo Airlines', notes: 'Client meeting Bangalore', isRecurring: false, isTaxDeductible: true },
            { amount: 4800, category: ExpenseCategory.TRAVEL, merchant: 'Ola Executive', notes: 'Office commute', isRecurring: false, isTaxDeductible: true },
            { amount: 9800, category: ExpenseCategory.SHOPPING, merchant: 'Dell Technologies', notes: 'Peripherals & equipment', isRecurring: false, isTaxDeductible: true },
            { amount: 4500, category: ExpenseCategory.SHOPPING, merchant: 'Amazon Business', notes: 'Office supplies', isRecurring: false, isTaxDeductible: true },
            { amount: 7200, category: ExpenseCategory.SHOPPING, merchant: 'Croma Electronics', notes: 'Tech accessories', isRecurring: false, isTaxDeductible: true },
            { amount: 2000, category: ExpenseCategory.FUN, merchant: 'BookMyShow', notes: 'Team outing / events', isRecurring: false, isTaxDeductible: false },
            { amount: 5500, category: ExpenseCategory.OTHER, merchant: 'Nykaa Fashion', notes: 'Promotional merchandise', isRecurring: false, isTaxDeductible: true },
            { amount: 3800, category: ExpenseCategory.OTHER, merchant: 'PayU Gateway', notes: 'Payment gateway fees', isRecurring: true, isTaxDeductible: true },
        ];

        for (let m = 11; m >= 0; m--) {
            const month = new Date(today.getFullYear(), today.getMonth() - m, 1);
            for (let i = 0; i < monthlyExpenseTemplates.length; i++) {
                const entry = monthlyExpenseTemplates[i];
                const day = Math.min(i + 1, 28);
                const date = new Date(month.getFullYear(), month.getMonth(), day);
                // Vary amount slightly each month
                const variance = 0.85 + Math.random() * 0.3;
                expenseData.push({
                    ...entry,
                    amount: Math.round(entry.amount * variance),
                    userId,
                    date: date.toISOString().split('T')[0],
                    isNecessary: entry.isTaxDeductible,
                });
            }
        }
        await this.expRepo.save(this.expRepo.create(expenseData));

        // Income — 12 months, 6 streams per month
        const incomeData: any[] = [];
        const incomeTemplates = [
            { amount: 180000, category: IncomeCategory.SALARY, source: 'Savora Technologies Pvt Ltd', notes: 'Monthly CTC credit', isRecurring: true },
            { amount: 45000, category: IncomeCategory.FREELANCE, source: 'TechCorp Global', notes: 'UI/UX consulting retainer', isRecurring: true },
            { amount: 28000, category: IncomeCategory.FREELANCE, source: 'Nexus Innovations', notes: 'Backend development project', isRecurring: false },
            { amount: 12000, category: IncomeCategory.INVESTMENT, source: 'Zerodha Portfolio', notes: 'Equity dividend & capital gains', isRecurring: false },
            { amount: 8000, category: IncomeCategory.OTHER, source: 'Udemy Course Sales', notes: 'Passive income from courses', isRecurring: false },
            { amount: 15000, category: IncomeCategory.FREELANCE, source: 'RetailOne Corp', notes: 'Mobile app consulting', isRecurring: false },
        ];

        for (let m = 11; m >= 0; m--) {
            const month = new Date(today.getFullYear(), today.getMonth() - m, 1);
            const days = [1, 5, 12, 15, 20, 25];
            for (let i = 0; i < incomeTemplates.length; i++) {
                const entry = incomeTemplates[i];
                const date = new Date(month.getFullYear(), month.getMonth(), days[i]);
                const variance = 0.9 + Math.random() * 0.2;
                incomeData.push({
                    ...entry,
                    amount: Math.round(entry.amount * variance),
                    userId,
                    date: date.toISOString().split('T')[0],
                });
            }
        }
        await this.incRepo.save(this.incRepo.create(incomeData));

        // Savings Goals — 8 goals at various completion stages
        await this.goalRepo.save(this.goalRepo.create([
            { userId, title: 'Emergency Fund', target: 600000, current: 420000, deadline: '2025-09-30', icon: 'shield', color: '#2563EB' },
            { userId, title: 'MacBook Pro M4 Max', target: 300000, current: 255000, deadline: '2025-06-30', icon: 'laptop', color: '#7C3AED' },
            { userId, title: 'Europe Trip 2025', target: 400000, current: 145000, deadline: '2025-12-01', icon: 'plane', color: '#059669' },
            { userId, title: 'Down Payment – Apartment', target: 2500000, current: 680000, deadline: '2027-06-01', icon: 'home', color: '#DC2626' },
            { userId, title: 'Startup Capital Fund', target: 1500000, current: 490000, deadline: '2026-09-01', icon: 'rocket', color: '#D97706' },
            { userId, title: 'Wedding Fund', target: 800000, current: 312000, deadline: '2026-02-14', icon: 'heart', color: '#EC4899' },
            { userId, title: 'New Car – Tata Nexon EV', target: 1600000, current: 720000, deadline: '2025-11-01', icon: 'car', color: '#0891B2' },
            { userId, title: 'Higher Education Fund', target: 1000000, current: 88000, deadline: '2028-01-01', icon: 'book', color: '#6366F1' },
        ] as any));

        // Subscriptions — 12 subscriptions
        await this.subRepo.save(this.subRepo.create([
            { userId, name: 'AWS', description: 'Cloud infrastructure & compute', amount: 12000, billingCycle: BillingCycle.MONTHLY, status: SubscriptionStatus.ACTIVE, category: 'Infrastructure', nextBillingDate: this.nextMonth(), startDate: '2024-01-01' },
            { userId, name: 'GitHub Teams', description: 'Code collaboration & CI/CD', amount: 4200, billingCycle: BillingCycle.MONTHLY, status: SubscriptionStatus.ACTIVE, category: 'Development', nextBillingDate: this.nextMonth(), startDate: '2023-06-01' },
            { userId, name: 'Figma Professional', description: 'UI/UX design tool', amount: 3600, billingCycle: BillingCycle.MONTHLY, status: SubscriptionStatus.ACTIVE, category: 'Design', nextBillingDate: this.nextMonth(), startDate: '2023-08-01' },
            { userId, name: 'Notion Team', description: 'Project & knowledge management', amount: 2400, billingCycle: BillingCycle.MONTHLY, status: SubscriptionStatus.ACTIVE, category: 'Productivity', nextBillingDate: this.nextMonth(), startDate: '2024-02-01' },
            { userId, name: 'Slack Pro', description: 'Team communication', amount: 6750, billingCycle: BillingCycle.MONTHLY, status: SubscriptionStatus.ACTIVE, category: 'Communication', nextBillingDate: this.nextMonth(), startDate: '2023-03-01' },
            { userId, name: 'Adobe Creative Cloud', description: 'Full design suite', amount: 54000, billingCycle: BillingCycle.YEARLY, status: SubscriptionStatus.ACTIVE, category: 'Design', nextBillingDate: '2026-01-01', startDate: '2025-01-01' },
            { userId, name: 'Zoom Business', description: 'Video conferencing', amount: 1800, billingCycle: BillingCycle.MONTHLY, status: SubscriptionStatus.PAUSED, category: 'Communication', nextBillingDate: this.nextMonth(), startDate: '2023-09-01' },
            { userId, name: 'Linear', description: 'Issue & project tracking', amount: 3000, billingCycle: BillingCycle.MONTHLY, status: SubscriptionStatus.ACTIVE, category: 'Development', nextBillingDate: this.nextMonth(), startDate: '2024-03-01' },
            { userId, name: 'Vercel Pro', description: 'Frontend deployment platform', amount: 1700, billingCycle: BillingCycle.MONTHLY, status: SubscriptionStatus.ACTIVE, category: 'Infrastructure', nextBillingDate: this.nextMonth(), startDate: '2024-05-01' },
            { userId, name: 'Datadog', description: 'Monitoring & observability', amount: 8900, billingCycle: BillingCycle.MONTHLY, status: SubscriptionStatus.ACTIVE, category: 'Infrastructure', nextBillingDate: this.nextMonth(), startDate: '2024-07-01' },
            { userId, name: 'Loom Business', description: 'Async video messaging', amount: 1200, billingCycle: BillingCycle.MONTHLY, status: SubscriptionStatus.ACTIVE, category: 'Productivity', nextBillingDate: this.nextMonth(), startDate: '2024-09-01' },
            { userId, name: 'Grammarly Business', description: 'AI writing assistant', amount: 2800, billingCycle: BillingCycle.MONTHLY, status: SubscriptionStatus.ACTIVE, category: 'Productivity', nextBillingDate: this.nextMonth(), startDate: '2024-10-01' },
        ] as any));

        // Clients — 8 clients
        const clients = await this.clientRepo.save(this.clientRepo.create([
            { userId, name: 'Arjun Mehta', email: 'arjun.mehta@techcorp.in', phone: '+91 98765 43210', company: 'TechCorp Global Pvt Ltd', address: 'Bandra Kurla Complex, Mumbai 400051', industry: 'Technology', status: ClientStatus.ACTIVE, totalBilled: 650000, totalPaid: 590000, notes: 'Long-term retainer client. Requires weekly check-ins. Excellent technical team.' },
            { userId, name: 'Priya Sharma', email: 'priya.s@nexus.co', phone: '+91 87654 32109', company: 'Nexus Innovations', address: 'Koramangala, Bangalore 560034', industry: 'SaaS', status: ClientStatus.ACTIVE, totalBilled: 420000, totalPaid: 420000, notes: 'Full payment always on time. Excellent relationship. Looking to expand scope.' },
            { userId, name: 'Rohit Bansal', email: 'rohit@greenleaf.org', phone: '+91 76543 21098', company: 'GreenLeaf Ventures', address: 'Cyber City, Gurugram 122002', industry: 'Finance', status: ClientStatus.ACTIVE, totalBilled: 280000, totalPaid: 195000, notes: 'Partial payment. Follow up on remaining 85,000. Good potential for Q2.' },
            { userId, name: 'Ananya Iyer', email: 'a.iyer@healthplus.com', phone: '+91 65432 10987', company: 'HealthPlus Systems', address: 'Jubilee Hills, Hyderabad 500033', industry: 'Healthcare', status: ClientStatus.INACTIVE, totalBilled: 120000, totalPaid: 120000, notes: 'Phase 1 completed. May return for Phase 2 development in Q3.' },
            { userId, name: 'Vikram Singh', email: 'vikram@retailone.in', phone: '+91 54321 09876', company: 'RetailOne Corp', address: 'Connaught Place, New Delhi 110001', industry: 'Retail', status: ClientStatus.PROSPECT, totalBilled: 0, totalPaid: 0, notes: 'In negotiation. Proposal sent for ₹3.5L e-commerce project. Hot lead.' },
            { userId, name: 'Kavya Reddy', email: 'kavya@finbridge.io', phone: '+91 91234 56789', company: 'FinBridge Technologies', address: 'HITEC City, Hyderabad 500081', industry: 'Fintech', status: ClientStatus.ACTIVE, totalBilled: 540000, totalPaid: 540000, notes: 'Premium client. Always on-time payments. Looking to renew annual contract.' },
            { userId, name: 'Sameer Kapoor', email: 'sameer@logisify.co', phone: '+91 80123 45678', company: 'Logisify Solutions', address: 'Whitefield, Bangalore 560066', industry: 'Logistics', status: ClientStatus.ACTIVE, totalBilled: 190000, totalPaid: 130000, notes: 'New client from referral. First project phase completed. ₹60K pending.' },
            { userId, name: 'Neha Verma', email: 'neha@edutechpro.in', phone: '+91 70987 65432', company: 'EduTech Pro', address: 'Powai, Mumbai 400076', industry: 'Education', status: ClientStatus.PROSPECT, totalBilled: 0, totalPaid: 0, notes: 'Intro call done. Interested in LMS development. Budget ₹5L. Follow up next week.' },
        ] as any));

        // Invoices — 12 invoices across all clients
        const clientMap = clients.reduce((m, c) => ({ ...m, [c.name]: c.id }), {} as Record<string, string>);
        await this.invRepo.save(this.invRepo.create([
            {
                userId, invoiceNumber: 'INV-0001', clientId: clientMap['Arjun Mehta'], clientName: 'Arjun Mehta', clientEmail: 'arjun.mehta@techcorp.in',
                clientAddress: 'Bandra Kurla Complex, Mumbai', status: InvoiceStatus.PAID, issueDate: '2024-11-01', dueDate: '2024-12-01', paidDate: '2024-11-28',
                items: [{ description: 'Full-Stack Development – Nov 2024', quantity: 1, rate: 120000, amount: 120000 }, { description: 'Deployment & DevOps Setup', quantity: 1, rate: 30000, amount: 30000 }],
                subtotal: 150000, taxRate: 18, taxAmount: 27000, total: 177000, currency: 'INR', notes: 'Thank you for your business!',
            },
            {
                userId, invoiceNumber: 'INV-0002', clientId: clientMap['Priya Sharma'], clientName: 'Priya Sharma', clientEmail: 'priya.s@nexus.co',
                clientAddress: 'Koramangala, Bangalore', status: InvoiceStatus.PAID, issueDate: '2024-12-01', dueDate: '2025-01-01', paidDate: '2024-12-29',
                items: [{ description: 'UI/UX Design – Dashboard Revamp', quantity: 1, rate: 80000, amount: 80000 }, { description: 'Prototype & Handoff', quantity: 1, rate: 20000, amount: 20000 }],
                subtotal: 100000, taxRate: 18, taxAmount: 18000, total: 118000, currency: 'INR', notes: '',
            },
            {
                userId, invoiceNumber: 'INV-0003', clientId: clientMap['Kavya Reddy'], clientName: 'Kavya Reddy', clientEmail: 'kavya@finbridge.io',
                clientAddress: 'HITEC City, Hyderabad', status: InvoiceStatus.PAID, issueDate: '2025-01-10', dueDate: '2025-02-10', paidDate: '2025-02-08',
                items: [{ description: 'Fintech Dashboard Development', quantity: 1, rate: 140000, amount: 140000 }, { description: 'API Integrations & Testing', quantity: 1, rate: 40000, amount: 40000 }],
                subtotal: 180000, taxRate: 18, taxAmount: 32400, total: 212400, currency: 'INR', notes: 'Phase 1 complete. Phase 2 to begin March.',
            },
            {
                userId, invoiceNumber: 'INV-0004', clientId: clientMap['Arjun Mehta'], clientName: 'Arjun Mehta', clientEmail: 'arjun.mehta@techcorp.in',
                clientAddress: 'Bandra Kurla Complex, Mumbai', status: InvoiceStatus.PAID, issueDate: '2025-02-01', dueDate: '2025-03-01', paidDate: '2025-02-27',
                items: [{ description: 'Full-Stack Development – Feb 2025', quantity: 1, rate: 120000, amount: 120000 }, { description: 'Performance Optimization', quantity: 1, rate: 15000, amount: 15000 }],
                subtotal: 135000, taxRate: 18, taxAmount: 24300, total: 159300, currency: 'INR', notes: '',
            },
            {
                userId, invoiceNumber: 'INV-0005', clientId: clientMap['Rohit Bansal'], clientName: 'Rohit Bansal', clientEmail: 'rohit@greenleaf.org',
                clientAddress: 'Cyber City, Gurugram', status: InvoiceStatus.OVERDUE, issueDate: '2025-02-15', dueDate: '2025-03-15',
                items: [{ description: 'Financial Dashboard Development', quantity: 1, rate: 95000, amount: 95000 }, { description: 'API Integration', quantity: 1, rate: 25000, amount: 25000 }],
                subtotal: 120000, taxRate: 18, taxAmount: 21600, total: 141600, currency: 'INR', notes: 'Payment overdue. Please clear at earliest.',
            },
            {
                userId, invoiceNumber: 'INV-0006', clientId: clientMap['Priya Sharma'], clientName: 'Priya Sharma', clientEmail: 'priya.s@nexus.co',
                clientAddress: 'Koramangala, Bangalore', status: InvoiceStatus.PAID, issueDate: '2025-03-01', dueDate: '2025-04-01', paidDate: '2025-03-28',
                items: [{ description: 'Mobile App UI Design', quantity: 1, rate: 70000, amount: 70000 }, { description: 'Design System Documentation', quantity: 1, rate: 15000, amount: 15000 }],
                subtotal: 85000, taxRate: 18, taxAmount: 15300, total: 100300, currency: 'INR', notes: '',
            },
            {
                userId, invoiceNumber: 'INV-0007', clientId: clientMap['Kavya Reddy'], clientName: 'Kavya Reddy', clientEmail: 'kavya@finbridge.io',
                clientAddress: 'HITEC City, Hyderabad', status: InvoiceStatus.SENT, issueDate: '2025-03-20', dueDate: '2025-04-20',
                items: [{ description: 'Fintech Platform – Phase 2', quantity: 1, rate: 160000, amount: 160000 }, { description: 'Security Audit & Compliance', quantity: 1, rate: 35000, amount: 35000 }],
                subtotal: 195000, taxRate: 18, taxAmount: 35100, total: 230100, currency: 'INR', notes: 'Due 20th April. Awaiting confirmation.',
            },
            {
                userId, invoiceNumber: 'INV-0008', clientId: clientMap['Arjun Mehta'], clientName: 'Arjun Mehta', clientEmail: 'arjun.mehta@techcorp.in',
                clientAddress: 'Bandra Kurla Complex, Mumbai', status: InvoiceStatus.SENT, issueDate: '2025-04-01', dueDate: '2025-05-01',
                items: [{ description: 'Full-Stack Development – Apr 2025', quantity: 1, rate: 120000, amount: 120000 }, { description: 'Cloud Infrastructure Setup', quantity: 1, rate: 25000, amount: 25000 }],
                subtotal: 145000, taxRate: 18, taxAmount: 26100, total: 171100, currency: 'INR', notes: '',
            },
            {
                userId, invoiceNumber: 'INV-0009', clientId: clientMap['Sameer Kapoor'], clientName: 'Sameer Kapoor', clientEmail: 'sameer@logisify.co',
                clientAddress: 'Whitefield, Bangalore', status: InvoiceStatus.OVERDUE, issueDate: '2025-03-10', dueDate: '2025-04-10',
                items: [{ description: 'Logistics Portal Development', quantity: 1, rate: 90000, amount: 90000 }, { description: 'Driver App – MVP', quantity: 1, rate: 50000, amount: 50000 }],
                subtotal: 140000, taxRate: 18, taxAmount: 25200, total: 165200, currency: 'INR', notes: 'Overdue by 11 days. Send reminder.',
            },
            {
                userId, invoiceNumber: 'INV-0010', clientId: clientMap['Ananya Iyer'], clientName: 'Ananya Iyer', clientEmail: 'a.iyer@healthplus.com',
                clientAddress: 'Jubilee Hills, Hyderabad', status: InvoiceStatus.PAID, issueDate: '2025-02-01', dueDate: '2025-03-01', paidDate: '2025-02-25',
                items: [{ description: 'Healthcare Portal Maintenance – Q1', quantity: 3, rate: 20000, amount: 60000 }],
                subtotal: 60000, taxRate: 18, taxAmount: 10800, total: 70800, currency: 'INR', notes: 'Quarterly maintenance contract.',
            },
            {
                userId, invoiceNumber: 'INV-0011', clientId: clientMap['Rohit Bansal'], clientName: 'Rohit Bansal', clientEmail: 'rohit@greenleaf.org',
                clientAddress: 'Cyber City, Gurugram', status: InvoiceStatus.DRAFT, issueDate: '2025-04-15', dueDate: '2025-05-15',
                items: [{ description: 'Analytics Dashboard – Phase 2', quantity: 1, rate: 80000, amount: 80000 }],
                subtotal: 80000, taxRate: 18, taxAmount: 14400, total: 94400, currency: 'INR', notes: 'Draft – confirm scope before sending.',
            },
            {
                userId, invoiceNumber: 'INV-0012', clientId: clientMap['Sameer Kapoor'], clientName: 'Sameer Kapoor', clientEmail: 'sameer@logisify.co',
                clientAddress: 'Whitefield, Bangalore', status: InvoiceStatus.DRAFT, issueDate: '2025-04-20', dueDate: '2025-05-20',
                items: [{ description: 'Route Optimization Module', quantity: 1, rate: 60000, amount: 60000 }, { description: 'Testing & QA', quantity: 1, rate: 15000, amount: 15000 }],
                subtotal: 75000, taxRate: 18, taxAmount: 13500, total: 88500, currency: 'INR', notes: 'Pending final feature sign-off.',
            },
        ] as any));

        // Tax Entries — 10 entries
        await this.taxRepo.save(this.taxRepo.create([
            { userId, title: 'Advance Tax – Q3 FY 2024-25', category: TaxCategory.ADVANCE_TAX, status: TaxStatus.PAID, amount: 38000, dueDate: '2024-12-15', paidDate: '2024-12-12', financialYear: 'FY 2024-25', referenceNumber: 'ADV-Q3-2425', notes: 'Paid via NSDL portal' },
            { userId, title: 'GST Return – November 2024', category: TaxCategory.GST, status: TaxStatus.FILED, amount: 58200, dueDate: '2024-12-20', paidDate: '2024-12-18', financialYear: 'FY 2024-25', referenceNumber: 'GSTR-NOV24', notes: 'GSTR-1 & GSTR-3B filed on time' },
            { userId, title: 'GST Return – December 2024', category: TaxCategory.GST, status: TaxStatus.FILED, amount: 62400, dueDate: '2025-01-20', paidDate: '2025-01-19', financialYear: 'FY 2024-25', referenceNumber: 'GSTR-DEC24', notes: 'GSTR-1 & GSTR-3B filed' },
            { userId, title: 'TDS on Professional Fees – Q3', category: TaxCategory.TDS, status: TaxStatus.PAID, amount: 18500, dueDate: '2025-01-07', paidDate: '2025-01-05', financialYear: 'FY 2024-25', referenceNumber: 'TDS-Q3-2425', notes: 'TDS deducted by TechCorp Global & Nexus' },
            { userId, title: 'Advance Tax – Q4 FY 2024-25', category: TaxCategory.ADVANCE_TAX, status: TaxStatus.PAID, amount: 42000, dueDate: '2025-03-15', paidDate: '2025-03-12', financialYear: 'FY 2024-25', referenceNumber: 'ADV-Q4-2425', notes: 'Paid via NSDL portal. Full advance tax settled.' },
            { userId, title: 'GST Return – February 2025', category: TaxCategory.GST, status: TaxStatus.FILED, amount: 68400, dueDate: '2025-03-20', paidDate: '2025-03-18', financialYear: 'FY 2024-25', referenceNumber: 'GSTR-FEB25', notes: 'GSTR-1 & GSTR-3B filed' },
            { userId, title: 'GST Return – March 2025', category: TaxCategory.GST, status: TaxStatus.PENDING, amount: 72000, dueDate: '2025-04-20', financialYear: 'FY 2024-25', referenceNumber: '', notes: 'Prepare GSTR-1 data from April invoices' },
            { userId, title: 'Income Tax – Self Assessment FY 2024-25', category: TaxCategory.INCOME_TAX, status: TaxStatus.PENDING, amount: 115000, dueDate: '2025-07-31', financialYear: 'FY 2024-25', referenceNumber: '', notes: 'Consult CA before filing. Collect Form 16 & 26AS.' },
            { userId, title: 'TDS on Professional Fees – Q4', category: TaxCategory.TDS, status: TaxStatus.PENDING, amount: 21000, dueDate: '2025-05-07', financialYear: 'FY 2024-25', referenceNumber: '', notes: 'Collect TDS certificates from clients before filing.' },
            { userId, title: 'Property Tax – FY 2024-25', category: TaxCategory.PROPERTY_TAX, status: TaxStatus.OVERDUE, amount: 18500, dueDate: '2025-03-31', financialYear: 'FY 2024-25', referenceNumber: '', notes: 'Municipal corporation – late fee of ₹925 may apply. Pay immediately.' },
        ] as any));

        // Investments — 12 positions across all asset classes
        await this.invstRepo.save(this.invstRepo.create([
            { userId, name: 'Reliance Industries', type: InvestmentType.STOCKS, investedAmount: 180000, currentValue: 238500, platform: 'Zerodha', ticker: 'RELIANCE', purchaseDate: '2023-06-15', notes: 'Long-term hold. Trailing 18 months.' },
            { userId, name: 'TCS', type: InvestmentType.STOCKS, investedAmount: 120000, currentValue: 108900, platform: 'Zerodha', ticker: 'TCS', purchaseDate: '2024-03-10', notes: 'IT sector. Averaging down on dips.' },
            { userId, name: 'Infosys Ltd', type: InvestmentType.STOCKS, investedAmount: 85000, currentValue: 79200, platform: 'Zerodha', ticker: 'INFY', purchaseDate: '2024-01-10', notes: 'IT sector exposure.' },
            { userId, name: 'HDFC Flexi Cap Fund', type: InvestmentType.MUTUAL_FUND, investedAmount: 360000, currentValue: 452000, platform: 'Groww', ticker: 'HDFCFLEXICAP', purchaseDate: '2022-10-01', notes: 'SIP ₹15,000/month. Core holding.' },
            { userId, name: 'Mirae Asset Large Cap', type: InvestmentType.MUTUAL_FUND, investedAmount: 240000, currentValue: 298000, platform: 'Kuvera', ticker: 'MIRAELARGE', purchaseDate: '2022-07-01', notes: 'Core portfolio. Long-term.' },
            { userId, name: 'Parag Parikh Flexi Cap', type: InvestmentType.MUTUAL_FUND, investedAmount: 180000, currentValue: 224000, platform: 'Kuvera', ticker: 'PPFCF', purchaseDate: '2023-01-15', notes: 'International diversification via this fund.' },
            { userId, name: 'Bitcoin', type: InvestmentType.CRYPTO, investedAmount: 150000, currentValue: 218000, platform: 'CoinDCX', ticker: 'BTC', purchaseDate: '2023-11-20', notes: 'High risk allocation. Max 10% of portfolio.' },
            { userId, name: 'Ethereum', type: InvestmentType.CRYPTO, investedAmount: 80000, currentValue: 94500, platform: 'CoinDCX', ticker: 'ETH', purchaseDate: '2024-02-01', notes: 'DeFi exposure.' },
            { userId, name: 'SBI Fixed Deposit', type: InvestmentType.FIXED_DEPOSIT, investedAmount: 500000, currentValue: 539000, platform: 'SBI', ticker: null, purchaseDate: '2024-03-01', notes: '7.1% p.a. for 1 year. Matures March 2025.' },
            { userId, name: 'Sovereign Gold Bond 2023', type: InvestmentType.GOLD, investedAmount: 95000, currentValue: 118000, platform: 'HDFC Bank', ticker: 'SGB2023', purchaseDate: '2023-04-10', notes: '2.5% annual interest + gold price returns.' },
            { userId, name: 'PPF Account', type: InvestmentType.PPF, investedAmount: 150000, currentValue: 163500, platform: 'Post Office', ticker: null, purchaseDate: '2023-04-01', notes: '7.1% p.a. tax-free. Lock-in 15 years.' },
            { userId, name: 'NIFTY 50 Index Fund', type: InvestmentType.MUTUAL_FUND, investedAmount: 200000, currentValue: 251000, platform: 'Groww', ticker: 'NIFTY50IDX', purchaseDate: '2023-08-01', notes: 'Passive index exposure. Low expense ratio.' },
        ] as any));

        return { message: 'Demo data seeded successfully! Savora dashboard is fully loaded with rich data.' };
    }

    private nextMonth(): string {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d.toISOString().split('T')[0];
    }
}
