import { Document } from 'mongoose';
import { IUser, UserRole } from '@nest-monorepo/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
class User extends Document implements IUser {
  @Prop()
  displayName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({
    required: true,
    enum: UserRole,
    type: String,
    default: UserRole.STUDENT,
  })
  role: UserRole;
}

const UserSchema = SchemaFactory.createForClass(User);

export { User, UserSchema };
