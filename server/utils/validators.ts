import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import { responseapi } from '../commanfunction'
import { Statuscodes } from '../utils/statuscodeconstant'

export enum ValidationSource {
  BODY = 'body',
  HEADER = 'headers',
  QUERY = 'query',
  PARAM = 'params',
}

export default (schema: Joi.ObjectSchema, source: ValidationSource = ValidationSource.BODY) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    
    if(req.method.toLowerCase().trim() === 'get') {
      req[source] = req.query
    }
    const { error } = schema.validate(req[source]);
    if (!error) return next();
    
    const { details } = error;
    const message = details.map((i) => i.message.replace(/['"]+/g, '')).join(',');
    let statuscodeObj = new Statuscodes();
    return res.send(responseapi(req, new Date(), [], false, [{
      message: message
    }], 0, statuscodeObj.getStatusDetails('414')));
    
  } catch (error) {
    next(error);
  }
};
