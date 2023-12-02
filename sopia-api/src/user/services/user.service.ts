import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/services/auth.service';
import { User } from '../models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => AuthService)) private AuthService: AuthService,
  ) {}

  async createUser(params: {
    fullName: string;
    email: string;
    password: string;
  }): Promise<User> {
    params.password = await this.AuthService.generateHashPassword(
      params.password,
    );
    const user = new this.userModel(params);
    return user.save();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
