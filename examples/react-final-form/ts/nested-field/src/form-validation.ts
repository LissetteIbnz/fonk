import {
  Validators,
  ValidationSchema,
} from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

const validationSchema: ValidationSchema = {
  field: {
    'product.name': [Validators.required.validator],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
