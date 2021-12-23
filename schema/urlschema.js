const joi = require('joi');

const generateschema = joi.object({
    url: joi.string().required(),
    date:joi.required()
})
const Newpasswordschema = joi.object({
    password : joi.string().min(6).required(),
})
module.exports = {
    generateschema,
    Newpasswordschema
}