let globalId = 0;
export class User {
  username: string;
  email: string;
  id: number;
  password: string;

  constructor(email: string, pass: string) {
    this.id = globalId++;
    this.email = email;
    this.password = pass;
  }
}
