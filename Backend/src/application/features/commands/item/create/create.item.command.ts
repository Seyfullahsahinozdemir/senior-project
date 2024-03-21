import { Dependencies } from '@infrastructure/di';
import { validate } from './create.item.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { CategoryTypeEnum } from '@application/enums/category.type.enum';
import { NotFoundException } from '@application/exceptions';

export type CreateCommandRequest = Readonly<{
  urlName: string;
  description: string | null;
  title: string;
  topCategory: string;
  subCategories: string[] | null;
  image: { filename: string; mimetype: string };
}>;

export function makeCreateCommand({
  itemService,
  categoryRepository,
  imageRepository,
}: Pick<Dependencies, 'itemService' | 'categoryRepository' | 'imageRepository'>) {
  return async function createCommand(command: CreateCommandRequest, res: Response) {
    await validate(command);

    const categories = await categoryRepository.find({ name: command.topCategory, description: CategoryTypeEnum.TOP });
    if (categories.length == 0) {
      throw new NotFoundException('Given top-category not found');
    }

    const image = await imageRepository.find({ filename: command.image.filename });
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    const item = await itemService.createItem({
      urlName: command.urlName,
      description: command.description,
      title: command.title,
      topCategory: command.topCategory,
      subCategories: command.subCategories,
      image: { filename: command.image.filename, mimetype: command.image.mimetype },
    });
    return new CustomResponse(item, 'Item created successful').created(res);
  };
}
