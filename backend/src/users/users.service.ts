import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async create(email: string, hashedPassword: string): Promise<User> {
        const user = this.usersRepository.create({
            email,
            password: hashedPassword,
        });
        return this.usersRepository.save(user);
    }

    async updateOtp(userId: string, otp: string | undefined, expires: Date | undefined): Promise<void> {
        await this.usersRepository.update(userId, { otp, otpExpires: expires });
    }

    async verifyUser(userId: string): Promise<void> {
        await this.usersRepository.update(userId, { isVerified: true, otp: undefined, otpExpires: undefined });
    }

    async updateProfile(userId: string, data: { name?: string }): Promise<User | null> {
        await this.usersRepository.update(userId, data);
        return this.findById(userId);
    }
}
