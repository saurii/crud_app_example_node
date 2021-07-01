import express, { Request, Response, NextFunction } from 'express';
import { responseapi } from './commanfunction'
import { _config } from './config/index';
import { _apiconfig } from './config/apiconfig'
import { Statuscodes } from './utils/statuscodeconstant'

import routesV1 from './api';

const app = express();

app.use(function(req, res:any, next) {
    res.header("Access-Control-Allow-Origin", _config.server.connections.routes.cors);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, userid, secretuser");
    res.header("Access-Control-Allow-Methods", "POST");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));

// Routes
app.use(_apiconfig.apiendpoint, routesV1);
let statuscodeObj = new Statuscodes();
// catch 404 and forward to error handler
app.use((req, res, next) => next(res.send(responseapi(req, new Date(), [], false, [], 0, statuscodeObj.getStatusDetails('400')))));

// Middleware Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== 'production') {
        return res.status(500).send(err.message);
    }
});

export default app;
