import * as Joi from 'joi';
export const ValidateCreateProduct = Joi.object({
  title: Joi.string().required().messages({
    'string.base': 'title must be a string',
    'any.required': 'title is required',
    'string.empty': 'title is required',
  }),
  code: Joi.string().required().messages({
    'any.required': 'code is required',
    'string.empty': 'code is required',
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

export const ValidateUpdateProduct = Joi.object({
  id: Joi.number().required().messages({
    'any.required': 'id is required',
  }),
  title: Joi.string().allow(),
  code: Joi.string().allow(),
  status: Joi.boolean().allow(),
  price: Joi.number().allow(),
  manufacture: Joi.object({
    id: Joi.number().required().messages({
      'any.required': 'manufacture id is required',
    }),
  }).allow(),
  category: Joi.object({
    id: Joi.number().required().messages({
      'any.required': 'category id is required',
    }),
  }).allow(),
});
