import { PoolConnection } from 'mysql'

export const rollbackAndHandleError = (conn: PoolConnection, e: any) => {
    return new Promise((resolve, reject) => {
        try {
            conn.rollback(function (rollBackErr: any) {
                if (rollBackErr) {
                    return resolve(rollBackErr)
                }
                try {
                    conn.release();
                    return resolve(true);
                } catch (_e) {
                    return resolve(_e);
                }
            })
        } catch (_e) {
            return resolve(_e);
        }
    })
}