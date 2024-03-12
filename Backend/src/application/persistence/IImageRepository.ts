import { Image } from '@domain/entities';
import { IRead } from './IRead';
import { IWrite } from './IWrite';

export interface IImageRepository extends IWrite<Image>, IRead<Image> {}
