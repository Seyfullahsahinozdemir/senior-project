import { BaseRepository } from './base.repository';
import { Dependencies } from '@infrastructure/di';
import { Image } from '@domain/entities';
import { IImageRepository } from '@application/persistence/IImageRepository';

export class ImageRepository extends BaseRepository<Image> implements IImageRepository {
  constructor(db: Pick<Dependencies, 'db'>) {
    super(db, 'image');
  }
}
