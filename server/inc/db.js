/*
    UNI WEB CONFERENCE PRO
    CURRENT VERSION 1.0.0
    POWERED BY FROSTWEEP GAMES
    PROGRAMMER ARTEM SHYRIAIEV
    LAST UPDATE AUGUST 06 2022
*/

const mysql = require('mysql');
const fs = require('fs');
const logger = require("./logger");

class DB {

    constructor(){
        this.config = JSON.parse(fs.readFileSync(__dirname + '/configs/server-config.json', 'utf8'));

        this.connectionPool = mysql.createPool({
            connectionLimit: this.config.db_connection_pool_size,
            host: this.config.db_host,
            database: this.config.db_name,
            user: this.config.db_user,
            password: this.config.db_password
        });
    }

    query(sql, callback){
        this.connectionPool.getConnection(function(error, connection) {
            if (error) console.error(error.message);

            connection.query(sql, function (error, result) {

                if (error) logger.log(error.message, "error");

                if(callback != null){
                    callback(result);
                }
              });

              connection.release();
          });
    }

    get(table, callback) {
        let sql = "SELECT * FROM " + table;

        this.connectionPool.getConnection(function(error, connection) {
            if (error) console.error(error.message);

            connection.query(sql, function (error, result) {

                if (error) logger.log(error.message, "error");

                if(callback != null){
                    callback(result);
                }
              });

              connection.release();
          });
    }

    insert(table, keyValuePair, callback){

        let keys   = Object.keys(keyValuePair);
        let values = Object.values(keyValuePair);

        let sql  = "INSERT INTO " + table + "(" + keys.join(',') + ") VALUES (" + values.join(',') + ")";

        this.connectionPool.getConnection(function(error, connection) {
            if (error) logger.log(error.message, "error");

            connection.query(sql, function (error, result) {

                if (error) logger.log(error.message, "error");

                if(callback != null){
                    callback(result);
                }
              });

              connection.release();
          });
    }

    update(table, keyValuePair, whereKeyValuePair, callback){

        let keys   = Object.keys(keyValuePair);
        let values = Object.values(keyValuePair);

        let set = "";
        let where = "";

        for(let i = 0; i < keys.length; i++){
            set += keys[i] + '="' + values[i] + '"';

            if(i < keys.length - 1)
                set += ",";
        }

        let whereKeys   = Object.keys(whereKeyValuePair);
        let whereValues = Object.values(whereKeyValuePair);

        for(let i = 0; i < whereKeys.length; i++){
            where += whereKeys[i] + '="' + whereValues[i] + '"';

            if(i < whereKeys.length - 1)
                where += " AND ";
        }

        let sql  = "UPDATE " + table + " SET " + set + " WHERE " + where;

        this.connectionPool.getConnection(function(error, connection) {
            if (error) logger.log(error.message, "error");

            connection.query(sql, function (error, result) {

                if (error) logger.log(error.message, "error");

                if(callback != null){
                    callback(result);
                }
              });

              connection.release();
          });
    }

    escape(parameter){
        return mysql.escape(parameter);
    }

    disconnect(){
        this.connectionPool.end(function(error) {
            if (error) {
              return logger.log(error.message, "error");
            }
            // close all connections
          });
    }
}

module.exports = {
    DB: DB
};