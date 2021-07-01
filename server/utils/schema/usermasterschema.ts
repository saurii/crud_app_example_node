import joi from '@hapi/joi';

exports.addusermaster = joi.object().keys({
    firstname: joi.string().required().lowercase().trim(),
    middlename: joi.string().required().lowercase().trim().allow(null),
    lastname: joi.string().required().lowercase().trim(),
    roleid: joi.number().required().min(1),
    mobileno: joi.string().required(),
    username: joi.string().required().lowercase().trim(),
    password: joi.string().required().trim(),
    createdby: joi.string().lowercase().required().trim()
})

exports.login = joi.object().keys({
    username: joi.string().required().lowercase().trim(),
    password: joi.string().required().trim()
})