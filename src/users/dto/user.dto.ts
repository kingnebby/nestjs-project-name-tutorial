import { Role } from 'src/authz/role.enum';

export class UserDto {
  username: string;
  email: string;
  id: number;
  roles: Role[];
}
