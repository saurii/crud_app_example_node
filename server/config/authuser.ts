import { getDatabasePool } from '../storage'
import decode from 'jwt-decode'
import moment from "moment";
import { Request, Response, NextFunction } from 'express';
import { decodeString,dataencryption } from '../commanfunction'
import * as dbComman from '../storage/db/db'
import { insertLogs } from '../utils/logsintodb'
import { sendResponse } from '../api/apientries'

export default () => (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let db = getDatabasePool();
    let apiExecutionStarttime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    db.getConnection((poolErr, conn) => {
        if (poolErr) {
            insertLogsData(req, apiExecutionStarttime, poolErr, req.originalUrl.split('/api/v1')[1], false);
            return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
        } else {
            try {
                if (!req.headers.authorization || req.headers.authorization == undefined) {
                    return sendResponse(0, apiExecutionStarttime, req, res, [], [], '401', false);
                } else {
                    let decryptedToken = dataencryption.decryptedString(req.headers.authorization);
                    const decoded: any = decode(decryptedToken);
                    let platform = process.env.NODE_ENV || 'development';
                    let _platformDecode = decoded && decoded.platform && decoded.platform ? decoded.platform.toLowerCase().trim() : null
                    if (_platformDecode && _platformDecode !== null && platform.toLowerCase().trim() == _platformDecode) {
                        if (decoded.exp === undefined)
                            return sendResponse(0, apiExecutionStarttime, req, res, [], [], '401', false);
                        else {
                            const date = new Date(0);
                            date.setUTCSeconds(decoded.exp);
                            if (date === undefined) {
                                return sendResponse(0, apiExecutionStarttime, req, res, [], [], '401', false);
                            } else if (date.valueOf() < new Date().valueOf()) {
                                return sendResponse(0, apiExecutionStarttime, req, res, [], [], '401', false);
                            } else {
                                let decodeCode = decodeString(`${decoded.username}`);
                                let usermasterObj = {
                                    query: `select COUNT(username) as totalcount FROM usermaster WHERE lower(username)=?`,
                                    data: [decodeCode.toLowerCase().trim()]
                                }
                                dbComman.queryAsync(conn, usermasterObj.query, usermasterObj.data)
                                    .then((isExistUser: any) => {
                                        isExistUser = JSON.parse(JSON.stringify(isExistUser))
                                        if (isExistUser && isExistUser[0].totalcount === 0) {
                                            return sendResponse(0, apiExecutionStarttime, req, res, [], [], '401', false);
                                        } else {
                                            return next();
                                        }
                                    }).catch((err) => {
                                        insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
                                        return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
                                    })
                            }
                        }
                    } else {
                        return sendResponse(0, apiExecutionStarttime, req, res, [], [], '401', false);
                    }
                }
            } catch (err) {
                if (err && err.toString().includes('digital envelope routines:EVP_DecryptFinal_ex:bad decrypt')) {
                    return sendResponse(0, apiExecutionStarttime, req, res, [], [], '401', false);
                } else {
                    insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
                    return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
                }
            }
        }
    })
}

function insertLogsData(req: any, apiExecutionStarttime: any, err: any, file: any, status: boolean) {
    return insertLogs(req, apiExecutionStarttime, err, 'error', file, status);
}

