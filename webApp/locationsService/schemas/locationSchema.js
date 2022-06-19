const joi = require('joi');

const schema = joi.object({
    str: joi.string().required(),
    lat: joi.number().required(),
    long: joi.number().required(),
    tags: joi.array().items(joi.string()).required(),
    active: joi.string().default('true')
});

exports.validateLocation = (location) => schema.validate(location);