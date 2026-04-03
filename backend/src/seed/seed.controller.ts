import { Controller, Post, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SeedService } from './seed.service';

@Controller('seed')
@UseGuards(JwtAuthGuard)
export class SeedController {
    constructor(private readonly seedService: SeedService) {}

    @Post()
    seed(@Request() req: any) {
        return this.seedService.seedAll(req.user.id);
    }

    @Delete()
    clear(@Request() req: any) {
        return this.seedService.clearAll(req.user.id);
    }
}
