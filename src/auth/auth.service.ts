import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOne(email);

    if (user?.password === pass) {
      const { password, ...rest } = user;
      return rest;
    }

    return;
  }
}
