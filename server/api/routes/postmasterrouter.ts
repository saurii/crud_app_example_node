import express from 'express';

import * as postmaster from '../handlers/postmaster';
import validator from '../../utils/validators'
import { schema } from '../../utils/schema'
import authuser from '../../config/authuser'

const postmasterrouter = express.Router();

postmasterrouter.post('/', authuser(), validator(schema.postmaster.addpost),postmaster.addpost);
postmasterrouter.get('/', authuser(), validator(schema.postmaster.getpost),postmaster.getAllPostInfo);
postmasterrouter.put('/', authuser(), validator(schema.postmaster.updatepost),postmaster.updatepost);
postmasterrouter.delete('/', authuser(), validator(schema.postmaster.deletepost),postmaster.deletepost);

export default postmasterrouter;
