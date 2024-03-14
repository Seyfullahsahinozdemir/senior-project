import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { CreatePostCommandRequest } from './create.post.command';

export async function validate(command: CreatePostCommandRequest) {
  try {
    const schema = Yup.object().shape({
      content: Yup.string().required('Content is required'),
      items: Yup.array().of(Yup.string().required('Item ID is required')).required('Items are required'),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
