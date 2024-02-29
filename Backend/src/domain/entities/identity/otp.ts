import { BaseEntity } from '../common/base.entity';

export class Otp extends BaseEntity {
  email: string;
  otp: string;
  target: string;
  expirationDate: Date;

  constructor(email: string, otp: string, target: string, expirationDate: Date) {
    super();
    this.email = email;
    this.otp = otp;
    this.expirationDate = expirationDate;
    this.target = target;
  }
}
