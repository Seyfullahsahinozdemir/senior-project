import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { FollowCommandRequest } from './follow.command';

export async function validate(command: FollowCommandRequest) {
  try {
    const schema: Yup.ObjectSchema<FollowCommandRequest> = Yup.object().shape({
      currentUserId: Yup.string().required(),
      targetUserId: Yup.string().required(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
