const Joi = require('joi');

module.exports.registrationValidation = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2 }),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
    )
    .messages({
      'string.pattern.base': `"password" should contain at least one number and one special character`,
    }),
});

module.exports.loginValidation = Joi.object({
  username: Joi.string(),
  email: Joi.string(),
  password: Joi.string().required(),
}).xor('email', 'username');
