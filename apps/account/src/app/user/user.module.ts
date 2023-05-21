import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import UserRepository from './repositories/user.repository';
import { User, UserSchema } from './models/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
