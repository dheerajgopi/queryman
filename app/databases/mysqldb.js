"use strict";

const mysql = require ('mysql');

class MysqlConnector {
    constructor (host, user, pswd, dbName, connLimit) {
        this.host = host;
        this.user = user;
        this.pswd = pswd;
        this.dbName = dbName;
        this.pool = mysql.createPool ({
            host: host,
            user: user,
            password: pswd,
            database: dbName,
            connectionLimit: connLimit
        });
    }

    query (queryString, rowProcessFunc=console.log) {
        this.pool.getConnection((errConn, connection) => {
            if (errConn) {
                throw errConn;
            }

            let res = connection.query(queryString);

            res.on('error', (err) => {
                throw err;
            });

            res.on('result', (row) => {
                // connection.pause();
                rowProcessFunc(row);
                // connection.resume();
            });

            res.on('end', () => {
                connection.release();
            });
        });
    }

    endConnect () {
        this.pool.end();
    }

    toString () {
        return `Host: ${this.host}\nUser: ${this.user}\nDatabase: ${this.dbName}`;
    }

    print () {
        console.log(this.toString());
    }
}

const connector = new MysqlConnector('host', 'uname', 'pswd', 'dbname');
connector.print();
connector.query('select * from dbtable');
// connector.endConnect();