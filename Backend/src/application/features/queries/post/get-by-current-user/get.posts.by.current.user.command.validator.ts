import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';

export async function validate(command: { pageIndex?: string; pageSize?: string; userId: string }) {
  try {
    const schema = Yup.object().shape({
      pageIndex: Yup.number().integer().optional(),
      pageSize: Yup.number().integer().optional(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
