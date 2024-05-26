import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { validate } from './get.favorite.items.by.current.user.command.validator';
import { MimetypeEnum } from '@application/enums/mimetype.enum';

export function makeGetFavoriteItemsByCurrentUserCommand({
  userService,
  userRepository,
  imageService,
  authService,
}: Pick<Dependencies, 'userService' | 'userRepository' | 'imageService' | 'authService'>) {
  return async function getFavoriteItemsByCurrentUserCommand(command: PaginatedRequest, res: Response) {
    await validate(command);
    const items = await userService.getFavoriteItemsByCurrentUser(command);

    const updatedItems = [];
    for (const item of items) {
      const user = await userRepository.findOne(item.createdBy as string);

      if (!item.image.fileId) {
        const fileId = await imageService.findFileIdByName(
          (item.image.filename as string) + (item.image.mimetype == MimetypeEnum.JPEG ? '.jpg' : '.png'),
        );
        const currentUser = await userRepository.findOne(authService.currentUserId as string);
        updatedItems.push({
          _id: item._id,
          urlName: item.urlName,
          description: item.description,
          title: item.title,
          topCategory: item.topCategory,
          subCategories: item.subCategories,
          image: { fileId: fileId, fileName: item.image.filename, mimetype: item.image.mimetype },
          createdAt: item.createdAt,
          createdBy: {
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
          me: item.createdBy === authService.currentUserId ? true : false,
          onFavorite: currentUser.favoriteItems.map(String).includes(item._id?.toString() ?? ''),
        });
      } else {
        const currentUser = await userRepository.findOne(authService.currentUserId as string);

        updatedItems.push({
          _id: item._id,
          urlName: item.urlName,
          description: item.description,
          title: item.title,
          topCategory: item.topCategory,
          subCategories: item.subCategories,
          image: item.image,
          createdAt: item.createdAt,
          createdBy: {
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
          me: item.createdBy === authService.currentUserId ? true : false,
          onFavorite: currentUser.favoriteItems.map(String).includes(item._id?.toString() ?? ''),
        });
      }
    }

    return new CustomResponse(updatedItems, 'Success.').success(res);
  };
}
