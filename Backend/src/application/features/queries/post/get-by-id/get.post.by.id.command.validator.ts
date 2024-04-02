import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';

export async function validate(command: { postId: string }) {
  try {
    const schema = Yup.object().shape({
      postId: Yup.string().required(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
