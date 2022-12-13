import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

// Seed user
const users: User[] = [new User('kingnebby@wayvdev.com', 'password')];

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto.email, '');
    users.push(user);
    return user;
  }

  findAll() {
    return users;
  }

  findOne(id: number): Promise<User>;
  findOne(email: string): Promise<User>;
  async findOne(identifier: number | string): Promise<User> {
    if (typeof identifier === 'string') {
      return users.find((e) => e.email === identifier);
    }
    return users.find((e) => e.id === identifier);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const index = users.findIndex((e) => e.id === id);
    users[index] = { ...users[index], ...updateUserDto };
  }

  remove(id: number) {
    users.splice(id, 1);
    return `This action removes a #${id} user`;
  }
}
