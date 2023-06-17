import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  AccountBuyCourse,
  AccountChangeProfile,
  AccountCheckPayment,
} from '@nest-monorepo/contracts';
import { UserService } from './user.service';

@Controller()
export class UserCommands {
  constructor(private readonly userService: UserService) {}

  @RMQValidate()
  @RMQRoute(AccountChangeProfile.topic)
  updateProfile(
    @Body() { id, user }: AccountChangeProfile.Request
  ): Promise<AccountChangeProfile.Response> {
    return this.userService.updateProfile(user, id);
  }

  @RMQValidate()
  @RMQRoute(AccountBuyCourse.topic)
  buyCourse(
    @Body() { userId, courseId }: AccountBuyCourse.Request
  ): Promise<AccountBuyCourse.Response> {
    return this.userService.buyCourse(userId, courseId);
  }

  @RMQValidate()
  @RMQRoute(AccountCheckPayment.topic)
  checkPayment(
    @Body() { userId, courseId }: AccountCheckPayment.Request
  ): Promise<AccountCheckPayment.Response> {
    return this.userService.checkPayment(userId, courseId);
  }
}
