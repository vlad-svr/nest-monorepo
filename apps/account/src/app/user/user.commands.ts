import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountRegister, AccountUserInfo } from '@nest-monorepo/contracts';

@Controller()
export class UserCommands {}
