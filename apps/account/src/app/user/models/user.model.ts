import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IUser,
  IUserCourses,
  PurchaseState,
  UserRole,
} from '@nest-monorepo/interfaces';

@Schema()
class UserCourses extends Document implements IUserCourses {
  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true, enum: PurchaseState, type: String })
  purchaseState: PurchaseState;
}

const UserCoursesSchema = SchemaFactory.createForClass(UserCourses);

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

  @Prop({ type: [UserCoursesSchema], _id: false })
  courses: Types.Array<UserCourses>;
}

const UserSchema = SchemaFactory.createForClass(User);

export { User, UserSchema, UserCourses, UserCoursesSchema };
