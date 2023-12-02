import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(params: {
    fullName: string;
    email: string;
    password: string;
  }): Promise<User> {
    const user = new this.userModel(params);
    return user.save();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
