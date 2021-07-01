import express from 'express';

import usermaster from './routes/usermasterrouter'
import postmaster from './routes/postmasterrouter'

const router = express.Router();

router.use('/student',usermaster);
router.use('/user',usermaster);
router.use('/post',postmaster);

export default router;
