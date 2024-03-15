import { Post } from '@domain/entities';

export interface ISearchService {
  get(file: Express.Multer.File): Promise<Post[]>;
}
