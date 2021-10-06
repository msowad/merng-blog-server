const Joi = require('joi');

module.exports.commentCreateValidation = Joi.object({
  body: Joi.string().min(10).required(),
});
