import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controllers/user.controller';
import { User, UserSchema } from './models/user.model';
import { UserService } from './services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule implements OnModuleInit {
  constructor(private readonly userService: UserService) {}

  async onModuleInit() {
    await this.seedData();
  }

  async seedData() {
    const defaultUser = {
      fullName: 'bennyli',
      email: 'dev@gmail.com',
      password: 'dev',
    };

    const existingUser = await this.userService.getUserByEmail(
      defaultUser.email,
    );
    if (!existingUser) {
      await this.userService.createUser(defaultUser);
      console.log('Default user seeded successfully.');
    }
  }
}
