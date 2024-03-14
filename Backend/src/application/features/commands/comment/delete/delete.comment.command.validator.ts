import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { DeleteCommentCommandRequest } from './delete.comment.command';

export async function validate(command: DeleteCommentCommandRequest) {
  try {
    const schema = Yup.object().shape({
      postId: Yup.string().required('Post ID is required'),
      commentId: Yup.string().required('Comment ID is required'),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
