import { IOtpRepository } from '@application/persistence';
import { BaseRepository } from './base.repository';
import { Otp } from '@domain/entities';
import { Dependencies } from '@infrastructure/di';

export class OtpRepository extends BaseRepository<Otp> implements IOtpRepository {
  constructor(db: Pick<Dependencies, 'db'>) {
    super(db, 'otp');
  }
}
