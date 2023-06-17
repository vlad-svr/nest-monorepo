import { IsString } from 'class-validator';
import { PaymentStatuses } from '../payment/payment.check';

export namespace AccountCheckPayment {
  export const topic = 'account.check-payment.command';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    courseId: string;
  }

  export class Response {
    status: PaymentStatuses;
  }
}
