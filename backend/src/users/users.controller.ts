import {
    Controller,
    Patch,
    Body,
    UseGuards,
    Request,
    Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(AuthGuard('jwt'))
    @Patch('profile')
    async updateProfile(
        @Request() req: any,
        @Body() updateData: { name?: string },
    ) {
        return this.usersService.updateProfile(req.user.id, updateData);
    }
}
