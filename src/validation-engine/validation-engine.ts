import {
  ValidationResult,
  FormValidationResult,
  FieldsValidationSchema,
  createDefaultValidationResult,
  RecordValidationFunctionSyncAsync,
  FieldValidationFunctionSyncAsync,
  FieldValidation,
  RecordValidationSchema,
  RecordValidationFull,
  FullFieldValidation,
} from '../model';

import { isUndefinedOrNull } from '../helper';

import {
  fireAllFieldsValidations,
  fireSingleFieldValidations,
  fireRecordValidations,
} from '../validation-dispatcher';
import { buildFormValidationResult } from '../form-validation-summary-builder';
import {
  convertFieldValidationToAsyncIfNeeded,
  convertRecordValidationToAsyncIfNeeded,
} from '../mappers';

export class ValidationEngine {
  private validationsPerField: FieldsValidationSchema = {};
  private validationsRecord: RecordValidationSchema[] = [];

  addFieldValidation(key: string, validationFull: FullFieldValidation) {
    validationFull.validator = convertFieldValidationToAsyncIfNeeded(
      validationFull.validator
    );

    if (!this.isFieldKeyMappingDefined(key)) {
      this.validationsPerField[key] = [];
    }

    this.validationsPerField[key].push(validationFull);
  }

  addRecordValidation(recordValidation: RecordValidationFull): void {
    // Sugar we admit both flavors syncrhonous and asynchronous validators
    recordValidation.validation = convertRecordValidationToAsyncIfNeeded(
      recordValidation.validation
    );

    this.validationsRecord.push(recordValidation);
  }

  public validateForm(values: any): Promise<FormValidationResult> {
    const allValidations = this.fireFieldAndRecordValidations(values);
    return this.buildValidationResults(allValidations);
  }

  validateField(
    fieldId: string,
    value: any,
    values: any
  ): Promise<ValidationResult> {
    const asyncValidationPromise = this.fireFieldValidations(
      values,
      fieldId,
      value
    );

    return asyncValidationPromise;
  }

  private fireFieldAndRecordValidations = (
    values: any
  ): Promise<ValidationResult>[] => {
    let fieldValidationResults: Promise<
      ValidationResult
    >[] = fireAllFieldsValidations(
      values,
      Object.keys(this.validationsPerField),
      this.fireFieldValidations
    );

    // Now record form validations
    if (this.validationsRecord.length > 0) {
      fieldValidationResults = [
        ...fieldValidationResults,
        ...this.validateRecordValidations(values),
      ];
    }
    return fieldValidationResults;
  };

  private buildValidationResults = (
    validations: Promise<ValidationResult>[]
  ): Promise<FormValidationResult> => {
    return new Promise<FormValidationResult>((resolve, reject) => {
      // Once all the single field validations have been resolved
      // resolve the fullFormValidatePromise
      // TODO: Finally issue race condition unit tests
      Promise.all(validations)
        .then((fieldValidationResults: ValidationResult[]) => {
          const formValidationResult = buildFormValidationResult(
            fieldValidationResults
          );
          resolve(formValidationResult);
        })
        .catch(result => {
          // Build failed validation Result
          const errorInformation = `Uncontrolled error when validating full form, check custom validations code`;
          console.log(errorInformation);
          reject(result);
        });
    });
  };

  public fireFieldValidations = (
    values: any,
    key: string,
    value: any
  ): Promise<ValidationResult> => {
    const fieldValidationResultPromise = new Promise<ValidationResult>(
      (resolve, reject) => {
        if (!this.isFieldKeyMappingDefined(key)) {
          resolve(createDefaultValidationResult());
        } else {
          fireSingleFieldValidations(
            values,
            value,
            this.validationsPerField[key]
          )
            .then((fieldValidationResult: ValidationResult) => {
              if (fieldValidationResult) {
                fieldValidationResult.key = key;
              }
              resolve(fieldValidationResult);
            })
            .catch(result => {
              // Build failed validation Result
              const errorInformation = `Validation Exception, field: ${key}`;
              console.log(errorInformation);
              reject(result);
            });
        }
      }
    );

    return fieldValidationResultPromise;
  };

  private validateRecordValidations(values: any): Promise<ValidationResult>[] {
    let recordResultValidations: Promise<ValidationResult>[] = [];

    if (this.validationsRecord.length > 0) {
      const recordValidationResultsPromises = fireRecordValidations(
        values,
        this.validationsRecord
      );
      recordResultValidations = [...recordValidationResultsPromises];
    }

    return recordResultValidations;
  }

  isFieldKeyMappingDefined(key: string): boolean {
    return !isUndefinedOrNull(this.validationsPerField[key]);
  }
}
