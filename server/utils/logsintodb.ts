import moment from 'moment';
import * as dbComman from '../storage/db/db'
import { getDatabasePool } from '../storage'
import fs from 'fs'
import path from 'path'
import { _loggerconfig } from '../config/loggerconfig'

export const insertLogs = (req: any, apiexecutionstarttime: any, errordetails: any, logtype: any, functionname: any, status: any) => {
    return new Promise((resolve, reject) => {
        try {
            let logObj = {
                Time: "",
                Status: status,
                response_message: "",
                Function: functionname,
                ExecutionStartTime: moment(apiexecutionstarttime).format('YYYY-MM-DD HH:mm:ss'),
                ExecutionEndTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                Params: JSON.stringify(req.body),
                ExecutionLaps: "",
                system: "crud_app",
                level: "",
                error: errordetails ? errordetails : null,
                url: req.originalUrl ? req.originalUrl : null,
                application: "crud_app",
                logtype: logtype,
                subsystem: "backend",
                message: ""
            }
            let db = getDatabasePool();
            db.getConnection((poolErr, conn) => {
                try {
                    if(_loggerconfig.filelogactive) addErrorLogstoFile(logObj);
                    
                    if (poolErr) {
                        return reject(poolErr);
                    } else {
                        let insertLogDetails = {
                            query: "insert into logdetails(logdetails,createdby,createddate,isactive) values(?,?,?,?)",
                            data: [JSON.stringify(logObj), req.body.createdby ? req.body.createdby.toLowerCase().trim() : 'system@adsys.com',
                            moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), true]
                        }
                        dbComman.queryAsync(conn, insertLogDetails.query, insertLogDetails.data)
                            .then(() => {
                                return resolve(true)
                            }).catch((err) => {
                                return reject(err)
                            })
                    }
                } catch (err) {
                    return reject(err);
                } finally {
                    conn.release();
                }
            })
        } catch (err) {
            return reject(err);
        }
    })
}

function addErrorLogstoFile(errorData: any) {
    let todayDate = moment(new Date()).format('YYYY-MM-DD') + ".json";
    if (fs.existsSync(path.join(process.cwd(), "/server/errorlogs/" + todayDate))) {
        fs.appendFile(path.join(process.cwd(), "/server/errorlogs/" + todayDate), JSON.stringify(errorData) + "\n", (err) => {
            if (err) console.error(err);
        });
    } else {
        fs.writeFile(path.join(process.cwd(), "/server/errorlogs/" + todayDate), JSON.stringify(errorData) + "\n", (err) => {
            if (err) console.error(err);
        });
    }
    return true;
}