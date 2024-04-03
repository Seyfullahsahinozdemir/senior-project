import { Preferences } from '@application/dto/user/preferences.user';
import { AuditableEntity } from '../common/auditable.entity';
import { ObjectId } from 'mongodb';

export class User extends AuditableEntity {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  preferences: Preferences;
  following: ObjectId[];
  followers: ObjectId[];

  favoriteItems: ObjectId[];

  constructor(firstName: string, lastName: string, username: string, email: string, password: string) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.password = password;
    this.isAdmin = false;
    this.preferences = { image: {} };
    this.following = [];
    this.followers = [];
    this.favoriteItems = [];
  }
}
