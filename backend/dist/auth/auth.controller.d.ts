import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(signupDto: SignupDto): Promise<{
        id: string;
        email: string;
    }>;
    login(loginDto: LoginDto, response: Response): Promise<{
        user: {
            id: string;
            email: string;
        };
    }>;
    logout(response: Response): Promise<{
        message: string;
    }>;
}
