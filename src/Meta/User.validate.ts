import { User } from '@Entities/User.entity';
import { UserService } from '@Services/User.service';
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

export const ValidateProfile = Joi.object({
  id: Joi.number().required().messages({
    'any.required': 'id is required',
    'number.base': 'id is not valid',
  }),
  firstName: Joi.string().required().messages({
    'any.required': 'firstName is required',
  }),
  lastName: Joi.string().required().messages({
    'any.required': 'lastName is required',
  }),
});

export const ValidateChangePassword = Joi.object({
  oldPassword: Joi.string().required().messages({
    'any.required': 'oldPassword is required',
  }),
  newPassword: Joi.string()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .min(8)
    .required()
    .messages({
      'string.min': 'newPassword is not valid',
      'any.required': 'newPassword is required',
      'string.pattern.base': 'newPassword is not valid',
    }),
  matchPassword: Joi.string()
    .required()
    .valid(Joi.ref('newPassword'))
    .label('Confirm password')
    .messages({
      'any.required': 'matchPassword is required',
      'any.only': 'matchPassword does not match',
    }),
});
