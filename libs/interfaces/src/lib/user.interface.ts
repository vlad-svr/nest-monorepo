enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

interface IUser {
  _id?: string;
  displayName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export { UserRole, IUser };
