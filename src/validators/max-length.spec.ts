import { validator, setErrorMessage } from './max-length';
import { LengthArgs } from './length';
import { FieldValidatorArgs } from '../model';

describe('[maxLength] validation rule tests =>', () => {
  describe('When validating a non string value', () => {
    it('should return true if value is undefined', () => {
      // Arrange
      const value = void 0;
      const values = undefined;
      const customArgs: LengthArgs = {
        length: 3,
      };
      // Act
      const validationResult = validator({ value, customArgs });

      // Assert
      expect(validationResult.succeeded).toBeTruthy;
      expect(validationResult.type).toBe('MAX_LENGTH');
    });

    it('should return true if value is null', () => {
      // Arrange
      const value = void 0;
      const values = null;
      const customArgs: LengthArgs = {
        length: 3,
      };
      // Act
      const validationResult = validator({ value, customArgs });

      // Assert
      expect(validationResult.succeeded).toBeTruthy;
      expect(validationResult.type).toBe('MAX_LENGTH');
    });
  });

  describe('When validating a string value', () => {
    // TODO: Should be add a custom param to skip when string is empty?
    it('should succeed for empty strings (use require validator for that case)', () => {
      // Arrange
      const value = '';
      const values = undefined;
      const customArgs: LengthArgs = {
        length: 3,
      };
      // Act
      const validationResult = validator({ value, customArgs });

      // Assert
      expect(validationResult.succeeded).toBeTruthy;
      expect(validationResult.type).toBe('MAX_LENGTH');
    });

    it('should succeed for empty strings and min-length === 0', () => {
      // Arrange
      const value = '';
      const values = undefined;
      const customArgs: LengthArgs = {
        length: 0,
      };
      // Act
      const validationResult = validator({ value, customArgs });

      // Assert
      expect(validationResult.succeeded).toBeTruthy;
      expect(validationResult.type).toBe('MAX_LENGTH');
    });

    it('should return true if value length is less than length option', () => {
      // Arrange
      const value = '1234';
      const values = undefined;
      const customArgs: LengthArgs = {
        length: 5,
      };
      // Act
      const validationResult = validator({ value, customArgs });

      // Assert
      expect(validationResult.succeeded).toBeTruthy;
      expect(validationResult.type).toBe('MAX_LENGTH');
    });

    it('should return false if value length is greater than length option', () => {
      // Arrange
      const value = '1234';
      const values = undefined;
      const customArgs: LengthArgs = {
        length: 3,
      };
      // Act
      const validationResult = validator({ value, customArgs });

      // Assert
      expect(validationResult.succeeded).toBeFalsy;
      expect(validationResult.type).toBe('MAX_LENGTH');
      expect(validationResult.message).toBe(
        'The value provided does not fulfill max length'
      );
    });

    it('should return false if value length is greater than length option and display custom message', () => {
      // Arrange
      const value = '1234';
      const values = undefined;
      const customArgs: LengthArgs = {
        length: 3,
      };

      setErrorMessage('my custom message');
      // Act
      const validationResult = validator({ value, customArgs });

      // Assert
      expect(validationResult.succeeded).toBeFalsy;
      expect(validationResult.type).toBe('MAX_LENGTH');
      expect(validationResult.message).toBe('my custom message');
    });

    it('should return true if value length is equal than length option', () => {
      // Arrange
      const value = '123';
      const values = undefined;
      const customArgs: LengthArgs = {
        length: 3,
      };
      // Act
      const validationResult = validator({ value, customArgs });

      // Assert
      expect(validationResult.succeeded).toBeTruthy;
      expect(validationResult.type).toBe('MAX_LENGTH');
    });

    it('should return failed if value has length greater than 0 and length option is 0', () => {
      // Arrange
      const value = '1';
      const values = undefined;
      const customArgs: LengthArgs = {
        length: 0,
      };
      // Act
      const validationResult = validator({ value, customArgs });

      // Assert
      expect(validationResult.succeeded).toBeFalsy();
      expect(validationResult.type).toBe('MAX_LENGTH');
    });

    it('should return failed with custom message when it feeds empty value and custom message with customArgs', () => {
      // Arrange
      const validationArgs: FieldValidatorArgs = {
        value: 'Test',
        message: 'Field must has a {{length}} max length',
        customArgs: { length: '2' },
      };

      // Act
      const validationResult = validator(validationArgs);

      // Assert
      expect(validationResult.succeeded).toBeFalsy();
      expect(validationResult.type).toBe('MAX_LENGTH');
      expect(validationResult.message).toBe('Field must has a 2 max length');
    });
  });

  describe('CustomParams boundaries =>', () => {
    it('should throw an error if no length option is provided', () => {
      // Arrange
      const value = 'test';
      const values = undefined;

      // Act
      // TODO: check how to acomplish this using jest toThrowError
      try {
        validator({
          value,
          values,
        });
      } catch (error) {
        // Assert
        expect(error.message).toBe(
          'FieldValidationError: Parameter "length" for maxLength in customArgs is mandatory and should be a valid number. Example: { length: 4 }.'
        );
      }
    });

    it('should return false if length option is null', () => {
      // Arrange
      const value = 'test';
      const values = undefined;
      const lengthArgs: LengthArgs = { length: null };

      // Act
      // TODO: check how to acomplish this using jest toThrowError
      try {
        validator({
          value,
          values,
          customArgs: lengthArgs,
        });
      } catch (error) {
        // Assert
        expect(error.message).toBe(
          'FieldValidationError: Parameter "length" for maxLength in customArgs is mandatory and should be a valid number. Example: { length: 4 }.'
        );
      }
    });
  });
});
