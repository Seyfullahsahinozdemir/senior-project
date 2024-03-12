import { Item } from '@domain/entities';
import { IRead } from './IRead';
import { IWrite } from './IWrite';

export interface IItemRepository extends IWrite<Item>, IRead<Item> {}
