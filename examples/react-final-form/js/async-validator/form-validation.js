import { Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';
import { userExistsOnGithubValidator } from './custom-validators';

const validationSchema = {
  field: {
    user: [Validators.required.validator, userExistsOnGithubValidator],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
