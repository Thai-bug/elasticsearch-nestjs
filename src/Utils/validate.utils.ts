import * as Joi from 'joi';

export const validate = async (schema: Joi.ObjectSchema, input: any) => {
  try {
    return await Joi.compile(schema).validateAsync(input);
  } catch (error) {
    return error;
  }
};
