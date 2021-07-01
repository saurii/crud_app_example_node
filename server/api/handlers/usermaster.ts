import { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import asyncHandler from '../../utils/asynchandler';
import { insertLogs } from '../../utils/logsintodb'
import * as rollbackhandler from '../../storage/db/rollbackhandler'
import { apientry, sendResponse } from '../apientries'
import * as dbComman from '../../storage/db/db'
import { generateToken } from '../../commanfunction'

export const registerStudent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let apiExecutionStarttime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    apientry(req, res, apiExecutionStarttime).then((conn: any) => {
        let usermasterExistQuery = {
            query: `select usermasterid from usermaster as u 
            inner join rolemaster as r on r.roleid=u.roleid where lower(u.username)=?`,
            data: [req.body.username.toLowerCase().trim()]
        }
        dbComman.queryAsync(conn, usermasterExistQuery.query, usermasterExistQuery.data)
            .then((resGetUser: any) => {
                if (resGetUser && resGetUser.length > 0) {
                    return sendResponse(0, apiExecutionStarttime, req, res, [], [{ key1: 'username' }], '403', false);
                } else {
                    let studentInsertQuery = {
                        query: `INSERT INTO usermaster(firstname,middlename,lastname,roleid,mobileno,username,password,createdby,createddate,isactive)VALUES(?,?,?,?,?,?,?,?,?,?)`,
                        data: [req.body.firstname ? req.body.firstname.toLowerCase().trim() : null, req.body.middlename ? req.body.middlename.toLowerCase().trim() : null,
                            req.body.lastname ? req.body.lastname.toLowerCase().trim() : null,  req.body.roleid, req.body.mobileno,
                            req.body.username.toLowerCase().trim(), req.body.password.trim(), 
                            req.body.createdby.toLowerCase().trim(), moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), true]
                    }
                    dbComman.queryAsync(conn, studentInsertQuery.query, studentInsertQuery.data)
                        .then(() => {
                            conn.commit();
                            return sendResponse(0, apiExecutionStarttime, req, res, [], [{ key1: 'student' }], '402', true);
                        }).catch((err) => {
                            rollbackhandler.rollbackAndHandleError(conn, err)
                                .then(() => {
                                    insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
                                    return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
                                })
                        })
                }
            }).catch((err) => {
                insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
                return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
            }).finally(() => {
                conn.release();
            })
    })
})

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	let apiExecutionStarttime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	apientry(req, res, apiExecutionStarttime).then((conn: any) => {
		let isUserExist = {
			query: `select u.*, r.rolename
				from usermaster as u
				inner join rolemaster as r on r.roleid = u.roleid
				where lower(u.username)=? and u.password=? and u.isactive=true and r.isactive=true limit 1`,
			data: [req.body.username.toLowerCase().trim(), req.body.password]
		}
		dbComman.queryAsync(conn, isUserExist.query, isUserExist.data)
			.then((resUserLogin: any) => {
                conn.commit();
				if (resUserLogin && resUserLogin.length > 0) {
                    resUserLogin[0].token = generateToken(resUserLogin[0].username).token;
                    resUserLogin[0].isactive = Boolean(resUserLogin[0].isacive);
                    return sendResponse(1, apiExecutionStarttime, req, res, resUserLogin, [], '408', true);
				} else {
					return sendResponse(0, apiExecutionStarttime, req, res, [], [], '409', false);
				}
			}).catch((err) => {
				rollbackhandler.rollbackAndHandleError(conn, err)
					.then(() => {
						insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
						return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
					})
			}).finally(() => {
				conn.release();
			})
	})
})

function insertLogsData(req: any, apiExecutionStarttime: any, err: any, file: any, status: boolean) {
    return insertLogs(req, apiExecutionStarttime, err, 'error', file, status);
}