const joi = require('joi');

const schema = joi.object({
    username: joi.string().alphanum().min(3).max(30).required(),
    password: joi.string().alphanum().min(3).max(30).required(),
    isAdmin: joi.string().default('false'),
    active: joi.string().default('true'),
});

exports.validateUser = (user) => schema.validate(user);