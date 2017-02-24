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

    query (queryString) {
        this.pool.getConnection((errConn, connection) => {
            console.log(connection);
            if (errConn) {
                connection.release();
                throw errConn;
            }

            let res = connection.query(queryString);

            res.on('error', (err) => {
                throw err;
            });

            res.on('result', (row) => {
                connection.pause();
                console.log(row);
                connection.resume();
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
connector.endConnect();
