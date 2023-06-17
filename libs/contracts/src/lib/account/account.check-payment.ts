import { IsString } from 'class-validator';
import { PurchaseState } from '@nest-monorepo/interfaces';

export namespace AccountCheckPayment {
  export const topic = 'account.check-payment.command';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    courseId: string;
  }

  export class Response {
    status: PurchaseState;
  }
}
