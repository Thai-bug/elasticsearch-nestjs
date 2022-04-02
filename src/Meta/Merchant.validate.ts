import * as Joi from 'joi';

export const ValidateCreateMerchant = Joi.object({
  code: Joi.string().min(3).max(5).required().messages({
    'string.base': 'code must be a string',
    'string.empty': 'code is required',
    'any.required': 'code is required',
    'string.max': 'code must be at most 5 characters',
    'string.min': 'code must be at least 3 characters',
  }),
  title: Joi.string().required().messages({
    'string.base': 'title must be a string',
    'string.empty': 'title is required',
    'any.required': 'title is required',
  }),
});

export const ValidateUpdateMerchant = Joi.object({
  id: Joi.number().required().messages({
    'number.base': 'id must be a number',
    'any.required': 'id is required',
  }),
  title: Joi.string().required().messages({
    'any.required': 'title is required',
    'string.empty': 'title is required',
  }),
  status: Joi.boolean().required().messages({
    'any.required': 'status is required',
  }),
  extraInfo: Joi.object().allow(),
});

export const CreateMerchantUserValidate = Joi.object({
  firstName: Joi.string().required().messages({
    'string.base': 'firstName must be a string',
    'string.empty': 'firstName is required',
    'any.required': 'firstName is required',
  }),
  lastName: Joi.string().required().messages({
    'string.base': 'lastName must be a string',
    'string.empty': 'lastName is required',
    'any.required': 'lastName is required',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'email must be a string',
    'any.required': 'email is required',
    'string.empty': 'email is required',
    'string.email': 'email is invalid',
  }),
  password: Joi.string()
    .min(8)
    .required()
    .regex(
      RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
    )
    .error(
      new Error(
        'Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length',
      ),
    ),
  role: Joi.allow(0),
});
