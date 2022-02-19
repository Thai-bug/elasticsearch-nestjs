import { IsEmail, IsNotEmpty } from 'class-validator';

export class Login {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}