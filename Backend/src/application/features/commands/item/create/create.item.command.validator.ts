import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { CreateCommandRequest } from './create.item.command';

export async function validate(command: CreateCommandRequest) {
  try {
    const schema = Yup.object().shape({
      urlName: Yup.string().required('URL name is required'),
      description: Yup.string().transform((value) => (value === '' ? null : value)),
      title: Yup.string().required('Title is required'),
      topCategory: Yup.string().required('Top category is required'),
      subCategories: Yup.array()
        .of(Yup.string().transform((value) => (value === '' ? null : value)))
        .nullable(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
