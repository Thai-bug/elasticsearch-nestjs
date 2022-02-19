import * as Joi from 'joi';

export const ValidateLogin = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'email is not valid',
    'any.required': 'email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'password is required',
  })
});
