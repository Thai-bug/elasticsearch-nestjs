import * as Joi from 'joi';
export const ValidateCreateProduct = Joi.object({
  title: Joi.string().required().messages({
    'string.base': 'title must be a string',
    'any.required': 'title is required',
  }),
  code: Joi.string().required().messages({
    'any.required': 'code is required',
  }),
  price: Joi.number().required().messages({
    'number.base': 'price must be a number',
    'any.required': 'price is required',
  }),
  manufacture: Joi.object({
    id: Joi.number().required().messages({
      'any.required': 'manufacture id is required',
    }),
  })
    .required()
    .messages({
      'any.required': 'manufacture is required',
    }),
  category: Joi.object({
    id: Joi.number().required().messages({
      'any.required': 'category id is required',
    }),
  })
    .required()
    .messages({
      'any.required': 'category is required',
    }),
});
