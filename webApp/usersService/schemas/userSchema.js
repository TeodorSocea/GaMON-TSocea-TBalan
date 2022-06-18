const joi = require('joi');

const schema = joi.object({
    username: joi.string()
        .required(),

    password: joi.string()
        .required(),

    isAdmin: joi.string().default('true')
});

exports.validateUser = (user) => schema.validate(user);