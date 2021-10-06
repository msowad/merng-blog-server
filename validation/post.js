const Joi = require('joi');

module.exports.postCreateValidation = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().min(10).required(),
});
