import { Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { IUser } from '@nest-monorepo/interfaces';
import { Cron } from '@nestjs/schedule';

@Controller('user')
export class UserController {
  constructor(private readonly rmqService: RMQService) {}

  @UseGuards(JwtAuthGuard)
  @Post('info')
  async info(@CurrentUser() user: IUser) {}

  @Cron('*/5 * * * * *')
  async cron() {
    Logger.log('Cron testing');
  }
}
