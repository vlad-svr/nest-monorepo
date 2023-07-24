import { Injectable } from '@nestjs/common';
import { IUser } from '@nest-monorepo/interfaces';
import { RMQService } from 'nestjs-rmq';
import UserEntity from './entities/user.entity';
import UserRepository from './repositories/user.repository';
import { BuyCourseSaga } from './sagas/buy-course.saga';
import { UserEventEmitter } from './user.event-emitter';

@Injectable()
class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rmqService: RMQService,
    private readonly userEventEmitter: UserEventEmitter
  ) {}

  public async updateProfile(user: Pick<IUser, 'displayName'>, id: string) {
    const foundUser = await this.userRepository.findUserById(id);
    if (!foundUser) {
      throw new Error('The user does not exist');
    }
    const userEntity = new UserEntity(foundUser).updateProfile(
      user.displayName
    );
    await this.updateUser(userEntity);

    return {};
  }

  public async buyCourse(userId: string, courseId: string) {
    const existedUser = await this.userRepository.findUserById(userId);

    if (!existedUser) {
      throw new Error("The user doesn't exist");
    }

    const userEntity = new UserEntity(existedUser);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const { user, paymentLink } = await saga.getState().pay();
    await this.updateUser(user);

    return { paymentLink };
  }

  public async checkPayment(userId: string, courseId: string) {
    const existedUser = await this.userRepository.findUserById(userId);

    if (!existedUser) {
      throw new Error("The user doesn't exist");
    }

    const userEntity = new UserEntity(existedUser);

    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const { user, status } = await saga.getState().checkPayment();
    await this.updateUser(user);

    return { status };
  }

  private updateUser(user: UserEntity) {
    return Promise.all([
      this.userEventEmitter.handle(user),
      this.userRepository.updateUser(user),
    ]);
  }
}

export { UserService };
