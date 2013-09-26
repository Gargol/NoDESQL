'use strict';

var r = require('rethinkdb');

var RethinkDBInterface = (function () {
  var interfaceName = 'rethink'
    , dbConfig = {
      host: '192.168.1.116',
      port: '28015',
      db: 'documents',
      table: 'documents'
    }
    , insert = function (obj, callback) {
      onConnect(function (err, connection) {
        r.db(dbConfig.db)
          .table(dbConfig.table)
          .insert(obj, {return_vals: true})
          .run(connection, function (err, result) {
            connection.close();
            if (err) {
              callback(err);
            }
            else {
              if (result.inserted === 1) {
                callback(null, result);
              }
              else {
                callback(null, result);
              }
            }
          });
      });
    }
    , get = function (id, callback) {
      onConnect(function (err, connection) {
        r.db(dbConfig.db)
          .table(dbConfig.table)
          .get(id)
          .run(connection, function (err, result) {
            if (err) {
              callback(err);
            }
            else {
              callback(null, result);
            }
            connection.close();
          });
      });
    }
    , getInsertId = function (obj) {
       return obj.new_val.id;
    }
    , remove = function () {

    }
    , onConnect = function (callback) {
      r.connect( {host: dbConfig.host, port: dbConfig.port},
        function (err, connection) {
          if(err){
            console.log('Error while connecting to RethinkDB server');
            callback(err);
          }
          else {
            connection['_id'] = Math.floor(Math.random() * 10001);
            callback(err, connection);
          }
        });
    };
  return{
    insert: insert,
    get: get,
    remove: remove,
    name: interfaceName,
    getInsertId: getInsertId
  };
})();

module.exports = RethinkDBInterface;