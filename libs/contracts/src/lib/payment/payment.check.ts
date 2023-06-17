import { IsString } from 'class-validator';

export enum PaymentStatuses {
  CANCELED = 'CANCELED',
  SUCCESS = 'SUCCESS',
  PROGRESS = 'PROGRESS',
}

export namespace PaymentCheck {
  export const topic = 'payment.check.query';

  export class Request {
    @IsString()
    courseId: string;

    @IsString()
    userId: string;
  }

  export class Response {
    status: PaymentStatuses;
  }
}
