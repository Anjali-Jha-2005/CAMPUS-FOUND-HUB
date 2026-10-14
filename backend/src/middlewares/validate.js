const Joi = require('joi');
const ErrorResponse = require('../utils/errorResponse');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');
    return next(new ErrorResponse(message, 400));
  }
  next();
};

const schemas = {
  register: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin'),
  }),
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required(),
  }),
  item: Joi.object({
    title: Joi.string().max(100).required(),
    description: Joi.string().max(1000).required(),
    category: Joi.string().required(),
    location: Joi.string().required(),
    type: Joi.string().valid('lost', 'found').required(),
    date: Joi.string().allow('', null),
    contact: Joi.string().allow('', null),
    tags: Joi.string().allow('', null),
  }).options({ allowUnknown: true }),
};

module.exports = { validate, schemas };
