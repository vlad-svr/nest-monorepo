import { Injectable } from '@nestjs/common';
import { UserRole } from '@nest-monorepo/interfaces';
import { JwtService } from '@nestjs/jwt';
import UserRepository from '../user/repositories/user.repository';
import UserEntity from '../user/entities/user.entity';
import { AccountRegister } from '@nest-monorepo/contracts';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async register({ email, password, displayName }: AccountRegister.Request) {
    const foundUser = await this.userRepository.findUser(email);

    if (foundUser) {
      throw new Error('This user is already registered');
    }

    const newUserEntity = await new UserEntity({
      role: UserRole.STUDENT,
      passwordHash: '',
      displayName,
      email,
    }).setPassword(password);

    const newUser = await this.userRepository.createUser(newUserEntity);

    return { email: newUser.email };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUser(email);

    if (!user) {
      throw new Error(`Password or login is not valid`);
    }

    const userEntity = new UserEntity(user);
    const isCorrectPassword = userEntity.validatePassword(password);

    if (!isCorrectPassword) {
      throw new Error(`Password or login is not valid`);
    }

    return { id: user._id };
  }

  async login(id: string) {
    return { access_token: await this.jwtService.signAsync({ id }) };
  }
}
