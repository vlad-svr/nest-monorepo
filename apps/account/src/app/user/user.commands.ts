import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountChangeProfile } from '@nest-monorepo/contracts';
import UserRepository from './repositories/user.repository';
import UserEntity from './entities/user.entity';

@Controller()
export class UserCommands {
  constructor(private readonly userRepository: UserRepository) {}

  @RMQValidate()
  @RMQRoute(AccountChangeProfile.topic)
  async updateUser(
    @Body() { id, user }: AccountChangeProfile.Request
  ): Promise<AccountChangeProfile.Response> {
    const foundUser = await this.userRepository.findUserById(id);
    if (!foundUser) {
      throw new Error('The user does not exist');
    }
    const userEntity = new UserEntity(foundUser).updateProfile(
      user.displayName
    );
    await this.userRepository.updateUser(userEntity);

    return {};
  }
}
