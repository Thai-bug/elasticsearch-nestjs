import * as Joi from 'joi';

export const ValidateCreateManufacture = Joi.object({
  code: Joi.string().required().messages({
    'any.required': 'code is required',
  }),
  title: Joi.string().required().messages({
    'any.required': 'title is required',
    'string.empty': 'title is required',
  }),
  extraInfo: Joi.object().allow(),
});

export const ValidateUpdateManufacture = Joi.object({
  id: Joi.number().required().messages({
    'any.required': 'code is required',
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
