import { Post } from '@domain/entities';
import { IRead } from './IRead';
import { IWrite } from './IWrite';

export interface IPostRepository extends IWrite<Post>, IRead<Post> {}
