import express from 'express';

import * as usermaster from '../handlers/usermaster';
import validator from '../../utils/validators'
import { schema } from '../../utils/schema'

const usermasterrouter = express.Router();

usermasterrouter.post('/', validator(schema.usermaster.addusermaster),usermaster.registerStudent);
usermasterrouter.post('/login', validator(schema.usermaster.login),usermaster.login);
export default usermasterrouter;
