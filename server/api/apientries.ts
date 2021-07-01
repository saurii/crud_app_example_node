import { Request, Response } from 'express';
import { responseapi } from '../commanfunction'
import { getDatabasePool } from '../storage'
import { Statuscodes } from '../utils/statuscodeconstant'
import { insertLogs } from '../utils/logsintodb'

export const apientry = (req: Request, res: Response, apiExecutionStarttime: any) => {
    return new Promise((resolve, reject) => {
        let statuscodeObj = new Statuscodes();
        let db = getDatabasePool();
        db.getConnection((poolErr, conn) => {
            try {
                if (poolErr) {
                    insertLogsData(req, apiExecutionStarttime, poolErr, req.originalUrl.split('/api/v1')[1], false);
                    return res.send(responseapi(req, apiExecutionStarttime, [], false, [], 0, statuscodeObj.getStatusDetails('1015')));
                } else {
                    conn.beginTransaction((transErr: any) => {
                        try {
                            if (transErr) {
                                insertLogsData(req, apiExecutionStarttime, transErr, req.originalUrl.split('/api/v1')[1], false);
                                return res.send(responseapi(req, apiExecutionStarttime, [], false, [], 0, statuscodeObj.getStatusDetails('1015')));
                            } else {
                                return resolve(conn)
                            }
                        } catch(err) {
                            insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
                            return res.send(responseapi(req, apiExecutionStarttime, [], false, [], 0, statuscodeObj.getStatusDetails('1015')));
                        }
                    })
                }
            } catch(err) {
                insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
                return res.send(responseapi(req, apiExecutionStarttime, [], false, [], 0, statuscodeObj.getStatusDetails('1015')));
            }
        })
    })
}

export const sendResponse = (rowcount: number, apiExecutionStarttime:any, req:Request, res:Response, data:any, msgkey: any, statuscode: any, status: boolean) => {
    let statuscodeObj = new Statuscodes();
    return res.send(responseapi(req, apiExecutionStarttime, msgkey, status, data, rowcount, statuscodeObj.getStatusDetails(statuscode)))
}

function insertLogsData(req: any, apiExecutionStarttime: any, err: any, file: any, status: boolean) {
    return insertLogs(req, apiExecutionStarttime, err, 'error', file, status);
}