import * as Joi from 'joi';

export const ValidateCreateManufacture = Joi.object({
  code: Joi.string().required().messages({
    'any.required': 'code is required',
  }),
  title: Joi.string().required().messages({
    'any.required': 'title is required',
  }),
  extraInfo: Joi.object().allow(),
});
