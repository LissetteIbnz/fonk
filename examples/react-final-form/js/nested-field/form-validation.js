import { createFormValidation, Validators } from "@lemoncode/fonk";

const validationSchema = {
  field: {
    "product.name": [Validators.required.validator]
  }
};

export const formValidation = createFormValidation(validationSchema);
