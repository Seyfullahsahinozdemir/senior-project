import { BaseRepository } from './base.repository';
import { Dependencies } from '@infrastructure/di';
import { Item } from '@domain/entities';

import { IItemRepository } from '@application/persistence';

export class ItemRepository extends BaseRepository<Item> implements IItemRepository {
  constructor(db: Pick<Dependencies, 'db'>) {
    super(db, 'item');
  }
}
