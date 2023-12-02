import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity, BaseEntitySchema } from 'src/common/base/base.entity';

export type UserDocument = Document<User>;

@Schema({ collection: 'users', timestamps: true })
export class User extends BaseEntity {
  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: Date, default: null })
  lockedUntil: Date;

  async isMatchPassword(plainTextPassword: string): Promise<boolean> {
    if (!this.password) {
      return false;
    }

    return this.password === plainTextPassword;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.add(BaseEntitySchema);
