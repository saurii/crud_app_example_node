import { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import asyncHandler from '../../utils/asynchandler';
import { insertLogs } from '../../utils/logsintodb'
import * as rollbackhandler from '../../storage/db/rollbackhandler'
import { apientry, sendResponse } from '../apientries'
import * as dbComman from '../../storage/db/db'
import { Queryset } from '../../storage/queries/queryset'

export const addpost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let apiExecutionStarttime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    apientry(req, res, apiExecutionStarttime).then((conn: any) => {
        let usermasterExistQuery = {
            query: `select u.username as username from usermaster as u 
            inner join rolemaster as r on r.roleid=u.roleid where lower(u.username)=? and lower(r.rolename)=?`,
            data: [req.body.createdby.toLowerCase().trim(), 'admin']
        }
        dbComman.queryAsync(conn, usermasterExistQuery.query, usermasterExistQuery.data)
            .then((resGetUser: any) => {
                resGetUser = JSON.parse(JSON.stringify(resGetUser))
                if (resGetUser && resGetUser.length > 0) {
                    let postInsertQuery = {
                        query: `INSERT INTO post(title,postdescription,createdby,createddate,isactive)VALUES(?,?,?,?,?)`,
                        data: [req.body.title.toLowerCase().trim(), req.body.postdescription.toLowerCase().trim(),
                        req.body.createdby.toLowerCase().trim(), moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), true]
                    }
                    dbComman.queryAsync(conn, postInsertQuery.query, postInsertQuery.data)
                        .then(() => {
                            conn.commit();
                            return sendResponse(0, apiExecutionStarttime, req, res, [], [{ key1: 'post' }], '402', true);
                        }).catch((err) => {
                            rollbackhandler.rollbackAndHandleError(conn, err)
                                .then(() => {
                                    insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
                                    return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
                                })
                        })
                } else {
                    return sendResponse(0, apiExecutionStarttime, req, res, [], [], '410', false);
                }
            }).catch((err) => {
                insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
                return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
            }).finally(() => {
                conn.release();
            })
    })
})

export const getAllPostInfo = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let apiExecutionStarttime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    apientry(req, res, apiExecutionStarttime).then((conn: any) => {
        getAllPostDetails(req, conn).then((resPostDetails: any) => {
            conn.commit();
            if (resPostDetails && Object.keys(resPostDetails).length > 0) {
                return sendResponse(resPostDetails.totalcount, apiExecutionStarttime, req, res, resPostDetails.data, [], '404', true);
            } else {
                return sendResponse(0, apiExecutionStarttime, req, res, [], [], '405', false);
            }
        }).catch((err) => {
            insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
            return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
        }).finally(() => {
            conn.release();
        })
    })
})

function getAllPostDetails(req: Request, conn: any) {
    return new Promise((resolve, reject) => {
        let getPostQuery = `select title,postdescription,isactive from post `;
        let fetchPostQuery = Queryset.getSelectQuery('post', [], false, req.query, true, getPostQuery, '');
        fetchPostQuery = Queryset.getPaginatedQuery(fetchPostQuery, req.query.page, req.query.pagesize);
        dbComman.queryAsync(conn, fetchPostQuery)
            .then((resGetPost: any) => {
                if (resGetPost && resGetPost.length > 0) {
                    let totalRowCountQuery = Queryset.getTotalCount(req.query, 'post', '');
                    dbComman.queryAsync(conn, totalRowCountQuery)
                        .then((resGetTotalCount: any) => {
                            resGetPost = JSON.parse(JSON.stringify(resGetPost));
                            resGetPost.forEach((element: any) => {
                                element.isactive = Boolean(element.isactive)
                            });
                            let totalcount = resGetTotalCount && resGetTotalCount[0] && resGetTotalCount[0].totalcount ? resGetTotalCount[0].totalcount : 0;
                            return resolve({ totalcount: totalcount, data: resGetPost });
                        }).catch((err) => {
                            return reject(err);
                        })
                } else {
                    return resolve({});
                }
            }).catch((err) => {
                return reject(err);
            })
    })
}

export const updatepost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let apiExecutionStarttime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    apientry(req, res, apiExecutionStarttime).then((conn: any) => {
        let usermasterExistQuery = {
            query: `select u.username as username from usermaster as u 
            inner join rolemaster as r on r.roleid=u.roleid where lower(u.username)=? and lower(r.rolename)=?`,
            data: [req.body.lastmodifiedby.toLowerCase().trim(), 'admin']
        }
        dbComman.queryAsync(conn, usermasterExistQuery.query, usermasterExistQuery.data)
            .then((resGetUser: any) => {
                resGetUser = JSON.parse(JSON.stringify(resGetUser))
                if (resGetUser && resGetUser.length > 0) {
                    updatePostDetails(req.body, conn)
                        .then((resUpdatePost) => {
                            conn.commit();
                            if (resUpdatePost === '406') {
                                return sendResponse(0, apiExecutionStarttime, req, res, [], [{
                                    key1: 'post'
                                }], '406', true);
                            } else {
                                return sendResponse(0, apiExecutionStarttime, req, res, [], [], '407', false);
                            }
                        }).catch((err) => {
                            insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
                            return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
                        })
                } else {
                    return sendResponse(0, apiExecutionStarttime, req, res, [], [], '410', false);
                }
            }).catch((err) => {
                insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
                return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
            }).finally(() => {
                conn.release();
            })
    })
})

function updatePostDetails(reqBody: any, conn: any) {
    return new Promise((resolve, reject) => {
        let updatePostQuery: any = Queryset.getUpdateQuery([
            { name: "title", rName: "title" },
            { name: "postdescription", rName: "postdescription" }
        ], reqBody, 'post');
        if (updatePostQuery) {
            updatePostQuery.query += `,lastmodifiedby='${reqBody.lastmodifiedby.toLowerCase().trim()}',lastmodifieddate='${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}' where postid=?`;
            updatePostQuery.data.push(reqBody.postid);
            dbComman.queryAsync(conn, updatePostQuery.query, updatePostQuery.data)
                .then(() => {
                    return resolve('406')
                }).catch((err) => {
                    return reject(err);
                })
        } else {
            return resolve('407')
        }
    })
}

export const deletepost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let apiExecutionStarttime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    apientry(req, res, apiExecutionStarttime).then((conn: any) => {
        let usermasterExistQuery = {
            query: `select u.username as username from usermaster as u 
            inner join rolemaster as r on r.roleid=u.roleid where lower(u.username)=? and lower(r.rolename)=?`,
            data: [req.body.lastmodifiedby.toLowerCase().trim(), 'admin']
        }
        dbComman.queryAsync(conn, usermasterExistQuery.query, usermasterExistQuery.data)
            .then((resGetUser: any) => {
                resGetUser = JSON.parse(JSON.stringify(resGetUser))
                if (resGetUser && resGetUser.length > 0) {
                    let postDeleteQuery = {
                        query: "delete from post where postid=?",
                        data: [req.body.postid]
                    }
                    dbComman.queryAsync(conn,postDeleteQuery.query, postDeleteQuery.data)
                        .then((resDelPost: any) => {
                            return sendResponse(0, apiExecutionStarttime, req, res, [], [], '411', true);
                        }).catch((err) => {
                            insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
                            return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
                        })
                } else {
                    return sendResponse(0, apiExecutionStarttime, req, res, [], [], '410', false);
                }
            }).catch((err) => {
                insertLogsData(req, apiExecutionStarttime, err, req.originalUrl.split('/api/v1')[1], false);
                return sendResponse(0, apiExecutionStarttime, req, res, [], [], '1015', false);
            }).finally(() => {
                conn.release();
            })
    })
})

function insertLogsData(req: any, apiExecutionStarttime: any, err: any, file: any, status: boolean) {
    return insertLogs(req, apiExecutionStarttime, err, 'error', file, status);
}