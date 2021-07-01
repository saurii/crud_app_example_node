import { QueryOptions } from 'mysql'

export const queryAsync = (conn: any, asyncQuery: string | QueryOptions, values: any = []) =>
    new Promise((resolve, reject) => {
        conn.query(asyncQuery, values, (pqErr: any, pqRows: any) => {
            if (pqErr) return reject(pqErr)
            resolve(pqRows)
        })
    });