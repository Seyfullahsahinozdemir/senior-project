import { Otp } from '@domain/entities';
import { IRead } from './IRead';
import { IWrite } from './IWrite';

export interface IOtpRepository extends IWrite<Otp>, IRead<Otp> {}
