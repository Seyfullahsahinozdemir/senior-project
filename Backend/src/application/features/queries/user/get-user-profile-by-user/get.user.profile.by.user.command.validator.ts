import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { GetUserProfileByUser } from './get.user.profile.by.user.command';

export async function validate(command: GetUserProfileByUser) {
  try {
    const schema: Yup.ObjectSchema<GetUserProfileByUser> = Yup.object().shape({
      _id: Yup.string().required(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
