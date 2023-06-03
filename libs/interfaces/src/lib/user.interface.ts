enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

enum PurchaseState {
  STARTED = 'Started',
  WAITING_FOR_PAYMENTS = 'Waiting for payments',
  PURCHASED = 'Purchased ',
  CANCELED = 'Canceled',
}

interface IUser {
  _id?: string;
  displayName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourses[];
}

interface IUserCourses {
  _id?: string;
  courseId: string;
  purchaseState: PurchaseState;
}

export { UserRole, IUser, IUserCourses, PurchaseState };
