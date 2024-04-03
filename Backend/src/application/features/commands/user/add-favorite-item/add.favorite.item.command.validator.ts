import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { AddFavoriteItemCommandRequest } from './add.favorite.item.command';

export async function validate(command: AddFavoriteItemCommandRequest) {
  try {
    const schema: Yup.ObjectSchema<AddFavoriteItemCommandRequest> = Yup.object().shape({
      itemId: Yup.string().required(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
