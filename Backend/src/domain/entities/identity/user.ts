import { AuditableEntity } from '../common/auditable.entity';
import { ObjectId } from 'mongodb';

type Preferences = {
  gender?: string;
  phone?: string;
  address?: string;
  about?: string;
  birthDate?: Date;
};

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

  constructor(firstName: string, lastName: string, username: string, email: string, password: string) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.password = password;
    this.isAdmin = false;
    this.preferences = {};
    this.following = [];
    this.followers = [];
  }
}
