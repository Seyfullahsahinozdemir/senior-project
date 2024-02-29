import { AuditableEntity } from '../common/auditable.entity';

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

  constructor(firstName: string, lastName: string, username: string, email: string, password: string) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.password = password;
    this.isAdmin = false;
    this.preferences = {};
  }
}
