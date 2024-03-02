import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { GetFollowersCommandRequest } from './get.followers.command';

export async function validate(command: GetFollowersCommandRequest) {
  try {
    const schema: Yup.ObjectSchema<GetFollowersCommandRequest> = Yup.object().shape({
      pageIndex: Yup.string().min(0).nullable(),
      pageSize: Yup.string().min(0).nullable(),
      _id: Yup.string().required(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
