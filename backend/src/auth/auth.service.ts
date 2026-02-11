import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async signup(signupDto: SignupDto) {
        const existing = await this.usersService.findByEmail(signupDto.email);
        if (existing) {
            throw new ConflictException('Email already in use');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(signupDto.password, salt);
        const user = await this.usersService.create(signupDto.email, hashedPassword);

        return { id: user.id, email: user.email };
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, email: user.email };
        const token = this.jwtService.sign(payload);

        return { token, user: { id: user.id, email: user.email } };
    }
}
