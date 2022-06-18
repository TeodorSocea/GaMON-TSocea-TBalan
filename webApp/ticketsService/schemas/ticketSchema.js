const joi = require('joi');

const schema = joi.object({
    submitterID: joi.number().required(),
    locationID: joi.number().required(),
    paper: joi.number(),
    plastic: joi.number(),
    metal: joi.number(),
    glass: joi.number(),
    organic: joi.number(),
    comment: joi.string(),
    active: joi.string().default('true')
});

exports.validateTicket = (ticket) => schema.validate(ticket);