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
    comment: joi.string().pattern(new RegExp('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$')),
    active: joi.string().default('true')
});

exports.validateTicket = (ticket) => schema.validate(ticket);