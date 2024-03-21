import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { GetFollowingCommandRequest } from './get.following.command';

export async function validate(command: GetFollowingCommandRequest) {
  try {
    const schema: Yup.ObjectSchema<GetFollowingCommandRequest> = Yup.object().shape({
      pageIndex: Yup.string().min(0).nullable(),
      pageSize: Yup.string().min(0).nullable(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
