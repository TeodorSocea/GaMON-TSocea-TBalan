const joi = require('joi');

const schema = joi.object({
    submitterID: joi.number().required(),
    locationID: joi.number().required(),
    dateSubmitted: joi.date(),
    dateSolved: joi.date(),
    paper: joi.number().default(0),
    plastic: joi.number().default(0),
    metal: joi.number().default(0),
    glass: joi.number().default(0),
    organic: joi.number().default(0),
    comment: joi.string(),
    active: joi.string().default('true')
});

exports.validateTicket = (ticket) => schema.validate(ticket);