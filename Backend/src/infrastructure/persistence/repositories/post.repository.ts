import { Post } from '@domain/entities';
import { BaseRepository } from './base.repository';
import { Dependencies } from '@infrastructure/di';
import { IPostRepository } from '@application/persistence';

export class PostRepository extends BaseRepository<Post> implements IPostRepository {
  constructor(db: Pick<Dependencies, 'db'>) {
    super(db, 'post');
  }
}
