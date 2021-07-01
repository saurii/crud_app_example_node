import joi from '@hapi/joi';

exports.addpost = joi.object().keys({
    title: joi.string().required().lowercase().trim(),
    postdescription: joi.string().required().lowercase().trim().max(255),
    createdby: joi.string().lowercase().required().trim()
})

exports.getpost = joi.object().keys({
    title: joi.string().lowercase().trim().allow(null),
    page: joi.number().required().min(1),
    pagesize: joi.number().required().min(1)
})

exports.updatepost = joi.object().keys({
    postid: joi.number().required().min(1),
    title: joi.string().required().lowercase().trim().allow(null),
    postdescription: joi.string().required().lowercase().trim().max(255).allow(null),
    lastmodifiedby: joi.string().lowercase().required().trim()
})

exports.deletepost = joi.object().keys({
    postid: joi.number().required().min(1),
    lastmodifiedby: joi.string().lowercase().required().trim()
})