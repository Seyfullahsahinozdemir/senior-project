import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { DeleteCommandRequest } from './delete.item.command';

export async function validate(command: DeleteCommandRequest) {
  try {
    const schema: Yup.ObjectSchema<DeleteCommandRequest> = Yup.object().shape({
      _id: Yup.string().required(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
