import Joi from "joi";
import { joiValidationSchemaText } from "../../responseTexts.js";

// Reusable primitives
const email = Joi.string()
  .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  .required()
  .messages({
    "string.pattern.base": joiValidationSchemaText.email.base,
    "string.empty": joiValidationSchemaText.email.empty,
    "any.required": joiValidationSchemaText.email.required,
  });

const password = Joi.string().min(8).required().messages({
  "string.base": joiValidationSchemaText.password.base,
  "string.min": joiValidationSchemaText.password.min,
  "any.required": joiValidationSchemaText.password.required,
});

const otpCode = Joi.string().length(6).required().messages({
  "string.length": joiValidationSchemaText.otpCode.length,
  "any.required": joiValidationSchemaText.otpCode.required,
});

const digitString = (fieldName, minLen = 1) =>
  Joi.string()
    .pattern(/^\d+$/)
    .min(minLen)
    .required()
    .messages({
      "string.base": joiValidationSchemaText.digitString.base(fieldName),
      "string.pattern.base":
        joiValidationSchemaText.digitString.pattern(fieldName),
      "string.min": joiValidationSchemaText.digitString.min(fieldName, minLen),
      "any.required": joiValidationSchemaText.digitString.required(fieldName),
    });

const textField = (fieldName, maxLength = 400) =>
  Joi.string()
    .trim()
    .min(1)
    .max(maxLength)
    .required()
    .messages({
      "string.base": joiValidationSchemaText.textField.base(fieldName),
      "string.empty": joiValidationSchemaText.textField.empty(fieldName),
      "string.max": joiValidationSchemaText.textField.max(fieldName, maxLength),
      "any.required": joiValidationSchemaText.textField.required(fieldName),
    });

const optionalTextField = (fieldName, maxLength = 400) =>
  Joi.string()
    .trim()
    .min(1)
    .max(maxLength)
    .optional()
    .messages({
      "string.base": joiValidationSchemaText.optionalTextField.base(fieldName),
      "string.empty":
        joiValidationSchemaText.optionalTextField.empty(fieldName),
      "string.max": joiValidationSchemaText.optionalTextField.max(
        fieldName,
        maxLength
      ),
    });

const objectId = Joi.string().hex().length(24).required().messages({
  "string.hex": joiValidationSchemaText.objectId.hex,
  "string.length": joiValidationSchemaText.objectId.length,
});

const optionalObjectId = Joi.string().hex().length(24).optional().messages({
  "string.hex": joiValidationSchemaText.objectId.hex,
  "string.length": joiValidationSchemaText.objectId.length,
});

export const joiLoginSchema = Joi.object({ email, password });
export const joiVerifyOtpSchema = Joi.object({ email, otpCode });
