import { User } from '../users/user.entity';
export declare class Budget {
    id: string;
    userId: string;
    user: User;
    monthlyLimit: number;
}
