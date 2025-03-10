import { LengthArgs, parseLengthParams, isLengthValid } from './length';
import { FieldValidationFunctionSync } from '../model';
import { parseMessageWithCustomArgs } from './validators.helpers';

const VALIDATOR_TYPE = 'MAX_LENGTH';

let defaultMessage = 'The value provided does not fulfill max length';
export const setErrorMessage = message => (defaultMessage = message);

const BAD_PARAMETER =
  'FieldValidationError: Parameter "length" for maxLength in customArgs is mandatory and should be a valid number. Example: { length: 4 }.';

const DEFAULT_PARAMS: LengthArgs = null;

const isStringLengthValid = (value: string, length: number): boolean =>
  value.length <= length;

export const validator: FieldValidationFunctionSync = fieldValidatorArgs => {
  if (!fieldValidatorArgs.customArgs) {
    throw new Error(BAD_PARAMETER);
  }

  const {
    value,
    customArgs = DEFAULT_PARAMS as LengthArgs,
    message = defaultMessage,
  } = fieldValidatorArgs;

  const length = parseLengthParams(customArgs, BAD_PARAMETER);
  const succeeded = isLengthValid(value, length, isStringLengthValid);

  return {
    succeeded,
    message: succeeded
      ? ''
      : parseMessageWithCustomArgs(message as string, customArgs),
    type: VALIDATOR_TYPE,
  };
};
