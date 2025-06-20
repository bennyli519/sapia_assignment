import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginInputDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
