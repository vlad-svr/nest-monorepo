import { BuyCourseSaga } from './buy-course.saga';
import UserEntity from '../entities/user.entity';

abstract class BuyCourseSagaState {
  public saga: BuyCourseSaga;

  public setContext(saga: BuyCourseSaga) {
    this.saga = saga;
  }

  public abstract pay(): Promise<{ paymentLink: string; user: UserEntity }>;
  public abstract checkPayment(): Promise<{ user: UserEntity }>;
  public abstract cancel(): { user: UserEntity };
}

export { BuyCourseSagaState };
