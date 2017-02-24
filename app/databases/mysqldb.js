"use strict";

const mysql = require ('mysql');

class MysqlConnector {
    constructor (host, user, pswd, dbName) {
        this.host = host;
        this.user = user;
        this.pswd = pswd;
        this.dbName = dbName;
        this.connection = mysql.createConnection ({
            host: host,
            user: user,
            password: pswd,
            database: dbName
        });
    }

    connect () {
        this.connection.connect((error) => {
            if (error) {
                throw error;
            }
        });

        this.connection.on('close', (err) => {
            // reconnect to mysql if connection is closed unexpectedly
            if (err) {
                this.connection = mysql.createConnection ({
                    host: host,
                    user: user,
                    password: pswd,
                    database: dbName
                });
            }
        });
    }

    query (queryString) {
        let res = this.connection.query(queryString);

        res.on('error', (err) => {
            throw err;
        });

        res.on('result', (row) => {
            this.connection.pause();
            console.log(row);
            this.connection.resume();
        })
    }

    endConnect () {
        this.connection.end();
    }

    toString () {
        return `Host: ${this.host}\nUser: ${this.user}\nDatabase: ${this.dbName}`;
    }

    print () {
        console.log(this.toString());
    }
}

const connector = new MysqlConnector('hostname', 'uname', 'pswd', 'dbname');
connector.connect();
connector.print();
connector.query('select * from dbtable')
connector.endConnect();
