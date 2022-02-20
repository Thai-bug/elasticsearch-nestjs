import { User } from '@Entities/User.entity';
import { UserService } from '@Services/UserService';
import * as Joi from 'joi';

let userService: UserService;

export const ValidateLogin = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'email is not valid',
    'any.required': 'email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'password is required',
  }),
});

export const ValidateRegister = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .external(async (value, helpers) => {
      const data = await User.findOne({ email: value });
      if (data) {
        throw new Error('email already exists');
      }

      return value;
    })
    .messages({
      'string.email': 'email is not valid',
      'any.required': 'email is required',
    }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'password is not valid',
    'any.required': 'password is required',
  }),
  firstName: Joi.string().required().messages({
    'any.required': 'firstName is required',
  }),
  lastName: Joi.string().required().messages({
    'any.required': 'lastName is required',
  }),
  role: Joi.object({
    id: Joi.number().required().messages({
      'number.base': 'role is not valid',
    }),
  })
    .required()
    .messages({
      'any.required': 'role is required',
    }),
});
