import { _config } from '../config';
import mysql from 'mysql'
var connectionPool: mysql.Pool
function connectDBRetryOnError() {
    connectionPool = mysql.createPool({
        host: _config.storage.main.host || 'localhost',
        user: _config.storage.main.username || 'root',
        password: _config.storage.main.password,
        database: _config.storage.main.database,
        port: Number(_config.storage.main.dbport) || 3306
    })      // Recreate the connection, since
    connectionPool.getConnection((poolErr, conn) => {
        if (poolErr) {
            console.error('error when connecting to db:', poolErr)
            setTimeout(connectDBRetryOnError, 2000) // to avoid a hot loop, and to allow our node script to
        } else {
            console.debug("Database Connected")
        }
        conn.release()
    })
    // process asynchronous requests in the meantime.

    connectionPool.on('error', function (err) {
        console.error('db error', err)
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {  // Connection to the MySQL server is usually
            connectDBRetryOnError()                     // lost due to either server restart, or a
        } else {                                        // connnection idle timeout (the wait_timeout
            throw err                                   // server variable configures this)
        }
    })
}
connectDBRetryOnError()

export function getDatabasePool() {
    return connectionPool
}