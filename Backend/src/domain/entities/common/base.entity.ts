import { IEntity } from './IEntity';
import { ObjectId } from 'mongodb';

export abstract class BaseEntity implements IEntity {
  _id?: ObjectId;
}
