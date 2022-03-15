import * as Joi from "joi";

export const ValidateCreateCategory = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'title is required',
  }),
  code: Joi.string().min(3).max(5).required().messages({
    'string.min': 'code must be at least 3 characters',
    'string.max': 'code must be at most 5 characters',
    'any.required': 'code is required',
  }),
  extraInfo: Joi.object().allow(''),
})

export const ValidateUpdateCategory = Joi.object({
  id: Joi.number().required().messages({
    'any.required': 'id is required',
  }),
  title: Joi.string().required().messages({
    'any.required': 'title is required',
  }),
  code: Joi.string().min(3).max(5).required().messages({
    'string.min': 'code must be at least 3 characters',
    'string.max': 'code must be at most 5 characters',
    'any.required': 'code is required',
  }),
  status: Joi.boolean().required().messages({
    'any.required': 'status is required',
  }),
  extraInfo: Joi.object().allow(''),
})