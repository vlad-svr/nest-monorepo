import { BuyCourseSagaState } from './buy-course.state';
import UserEntity from '../entities/user.entity';
import {
  CourseGetCourse,
  PaymentCheck,
  PaymentGenerateLink,
} from '@nest-monorepo/contracts';
import { PurchaseState } from '@nest-monorepo/interfaces';

class BuyCourseSagaStateStarted extends BuyCourseSagaState {
  public async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    const { course } = await this.saga.rmqService.send<
      CourseGetCourse.Request,
      CourseGetCourse.Response
    >(CourseGetCourse.topic, {
      id: this.saga.courseId,
    });

    if (!course) {
      throw new Error("This course doesn't exist");
    }

    if (course.price === 0) {
      this.saga.setState(PurchaseState.PURCHASED, course._id);
      return { paymentLink: null, user: this.saga.user };
    }

    const { paymentLink } = await this.saga.rmqService.send<
      PaymentGenerateLink.Request,
      PaymentGenerateLink.Response
    >(PaymentGenerateLink.topic, {
      courseId: course._id,
      userId: this.saga.user._id,
      sum: course.price,
    });

    this.saga.setState(PurchaseState.WAITING_FOR_PAYMENTS, course._id);
    return { paymentLink, user: this.saga.user };
  }

  public checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error(
      'It is not possible to check a status of the payment that has not started yet'
    );
  }

  public cancel(): { user: UserEntity } {
    this.saga.setState(PurchaseState.CANCELED, this.saga.courseId);

    return { user: this.saga.user };
  }
}

class BuyCourseSagaStateWaitingForPayments extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error('The payment is in progress, you can not pay again');
  }

  public async checkPayment(): Promise<{ user: UserEntity }> {
    const { status } = await this.saga.rmqService.send<
      PaymentCheck.Request,
      PaymentCheck.Response
    >(PaymentCheck.topic, {
      userId: this.saga.user._id,
      courseId: this.saga.courseId,
    });

    switch (status) {
      case 'SUCCESS':
        this.saga.setState(PurchaseState.PURCHASED, this.saga.courseId);
        break;
      case 'PROGRESS':
        break;
      case 'CANCELED':
        this.saga.setState(PurchaseState.CANCELED, this.saga.courseId);
        break;
    }

    return { user: this.saga.user };
  }

  public cancel(): { user: UserEntity } {
    throw new Error('You can not do this action');
  }
}

class BuyCourseSagaStatePurchased extends BuyCourseSagaState {
  pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error('It is not possible to pay for the paid course');
  }

  checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error(
      'It is not possible to check the payment in the paid course'
    );
  }

  cancel(): { user: UserEntity } {
    throw new Error('It is not possible to cancel the paid course');
  }
}

class BuyCourseSagaStateCanceled extends BuyCourseSagaState {
  pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    this.saga.setState(PurchaseState.STARTED, this.saga.courseId);

    return this.saga.getState().pay();
  }

  checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error(
      'It is not possible to check the payment in the canceled course'
    );
  }

  cancel(): { user: UserEntity } {
    throw new Error('It is not possible to cancel the canceled course');
  }
}

export {
  BuyCourseSagaStateStarted,
  BuyCourseSagaStateWaitingForPayments,
  BuyCourseSagaStatePurchased,
  BuyCourseSagaStateCanceled,
};
