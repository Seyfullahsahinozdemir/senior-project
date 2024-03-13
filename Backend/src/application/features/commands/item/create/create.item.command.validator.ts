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
      image: Yup.mixed()
        .test('fileFormat', 'Invalid file format', function (value) {
          if (!value) {
            return true; // No file provided is also valid, assuming it's optional
          }
          const file = value as Express.Multer.File;
          const allowedFormats = ['image/jpeg', 'image/png'];
          return allowedFormats.includes(file.mimetype);
        })
        .required('Image is required') as Yup.MixedSchema<Express.Multer.File>,
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
