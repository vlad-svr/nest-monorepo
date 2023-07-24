import UserEntity from '../entities/user.entity';
import { RMQService } from 'nestjs-rmq';
import { PurchaseState } from '@nest-monorepo/interfaces';
import { BuyCourseSagaState } from './buy-course.state';
import {
  BuyCourseSagaStateCanceled,
  BuyCourseSagaStatePurchased,
  BuyCourseSagaStateWaitingForPayments,
  BuyCourseSagaStateStarted,
} from './buy-course.steps';

class BuyCourseSaga {
  private state: BuyCourseSagaState;

  constructor(
    public user: UserEntity,
    public courseId: string,
    public rmqService: RMQService
  ) {
    this.setState(user.getCourseState(courseId), courseId);
  }

  setState(state: PurchaseState, courseId: string) {
    switch (state) {
      case PurchaseState.STARTED:
        this.state = new BuyCourseSagaStateStarted();
        break;
      case PurchaseState.WAITING_FOR_PAYMENTS:
        this.state = new BuyCourseSagaStateWaitingForPayments();
        break;
      case PurchaseState.PURCHASED:
        this.state = new BuyCourseSagaStatePurchased();
        break;
      case PurchaseState.CANCELED:
        this.state = new BuyCourseSagaStateCanceled();
        break;
    }

    this.state.setContext(this);
    this.user.setCourseStatus(courseId, state);
  }

  getState() {
    return this.state;
  }
}

export { BuyCourseSaga };
