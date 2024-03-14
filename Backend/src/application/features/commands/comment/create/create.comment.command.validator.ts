import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { CreateCommentCommandRequest } from './create.comment.command';

export async function validate(command: CreateCommentCommandRequest) {
  try {
    const schema = Yup.object().shape({
      postId: Yup.string().required('Post ID is required'),
      content: Yup.string().required('Content is required'),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
