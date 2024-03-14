import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { LikePostCommandRequest } from './like.post.command';

export async function validate(command: LikePostCommandRequest) {
  try {
    const schema = Yup.object().shape({
      postId: Yup.string().required('Post ID is required'),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
