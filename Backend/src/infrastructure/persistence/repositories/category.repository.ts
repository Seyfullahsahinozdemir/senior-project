import { BaseRepository } from './base.repository';
import { Dependencies } from '@infrastructure/di';
import { Category } from '@domain/entities';
import { ICategoryRepository } from '@application/persistence';

export class CategoryRepository extends BaseRepository<Category> implements ICategoryRepository {
  constructor(db: Pick<Dependencies, 'db'>) {
    super(db, 'category');
  }
}
