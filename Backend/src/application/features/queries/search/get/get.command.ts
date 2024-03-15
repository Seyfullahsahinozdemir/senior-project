import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export function makeGetCommand({ searchService }: Pick<Dependencies, 'searchService'>) {
  return async function getCommand(image: Express.Multer.File, res: Response) {
    const posts = await searchService.get(image);
    return new CustomResponse(posts, 'Posts retrieved successfully').success(res);
  };
}
