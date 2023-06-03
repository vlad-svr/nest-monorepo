import { IsString } from 'class-validator';
import { IUser } from '@nest-monorepo/interfaces';

export namespace AccountUserInfo {
  export const topic = 'account.user-info.query';

  export class Request {
    @IsString()
    id: string;
  }

  export class Response {
    profile: Pick<IUser, 'role' | 'email' | 'displayName'>;
  }
}
