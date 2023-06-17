import {
  IUser,
  IUserCourses,
  PurchaseState,
  UserRole,
} from '@nest-monorepo/interfaces';
import { compare, genSalt, hash } from 'bcryptjs';

class UserEntity implements IUser {
  _id?: string;
  displayName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses: IUserCourses[];

  constructor(user: IUser) {
    this._id = user._id;
    this.passwordHash = user.passwordHash;
    this.displayName = user.displayName;
    this.email = user.email;
    this.role = user.role;
    this.courses = user.courses;
  }

  public setCourseStatus(courseId: string, state: PurchaseState) {
    const exist = this.courses.find((c) => c._id === courseId);

    if (!exist) {
      this.courses.push({ courseId, purchaseState: state });
      return this;
    }

    if (state === PurchaseState.CANCELED) {
      this.courses = this.courses.filter((c) => c._id !== courseId);
      return this;
    }

    this.courses = this.courses.map((c) => {
      if (c._id === courseId) {
        c.purchaseState = state;
      }

      return c;
    });

    return this;
  }

  public getPublicProfile() {
    return {
      role: this.role,
      email: this.email,
      displayName: this.displayName,
    };
  }

  public async setPassword(password: string) {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);

    return this;
  }

  public validatePassword(password: string) {
    return compare(password, this.passwordHash);
  }

  public updateProfile(displayName: IUser['displayName']) {
    this.displayName = displayName;

    return this;
  }
}

export default UserEntity;
