import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { UnFollowCommandRequest } from './un.follow.command';

export async function validate(command: UnFollowCommandRequest) {
  try {
    const schema: Yup.ObjectSchema<UnFollowCommandRequest> = Yup.object().shape({
      currentUserId: Yup.string().required(),
      targetUserId: Yup.string().required(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
