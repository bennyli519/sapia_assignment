import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class BaseEntity {
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type BaseEntityDocument = BaseEntity & Document;

export const BaseEntitySchema = SchemaFactory.createForClass(BaseEntity);
