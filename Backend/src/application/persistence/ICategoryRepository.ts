import { Category } from '@domain/entities';
import { IRead } from './IRead';
import { IWrite } from './IWrite';

export interface ICategoryRepository extends IWrite<Category>, IRead<Category> {}
