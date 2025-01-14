import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

const validationSchema: ValidationSchema = {
  field: {
    user: [
      {
        validator: Validators.required.validator,
      },
    ],
    password: [
      {
        validator: Validators.required.validator,
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
