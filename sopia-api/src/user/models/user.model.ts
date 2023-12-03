import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity, BaseEntitySchema } from '../../common/base/base.entity';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User extends BaseEntity {
  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.add(BaseEntitySchema);
