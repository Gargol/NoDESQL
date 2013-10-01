'use strict';

var http = require('http')
  , bl = require('bl');

var CouchInterface = (function () {
  var interfaceName = 'couch'
    , dbConfig = {
      host: '192.168.1.114',
      port: '5984',
      db: 'nodesql',
      view: 'all'
    }
    , insert = function (obj, callback) {
      var req = http.request({
        host: dbConfig.host,
        port: dbConfig.port,
        method: 'POST',
        path: '/' + dbConfig.db,
        headers: {
          'Content-Type': 'application/json'
        }
      }, function (res) {
        res.setEncoding('utf8');

        res.pipe(bl(function (err, data) {
          callback(err, JSON.parse(data.toString()));
        }));
      });

      req.on('error', function (e) {
        callback(e);
      });

      req.write(JSON.stringify(obj));
      req.end();
    }
    , get = function (id, callback) {
      var params = '?key="'+ id + '"';
      var req = http.request({
        host: dbConfig.host,
        port: dbConfig.port,
        method: 'GET',
        path: '/' + dbConfig.db + '/_design/all/_view/' + dbConfig.view + params
      }, function (res) {
        res.setEncoding('utf8');

        res.pipe(bl(function (err, data) {
          callback(err, JSON.parse(data.toString()));
        }));
      });

      req.on('error', function (e) {
        callback(e);
      });

      req.end();
    }
    , getInsertId = function (obj) {
      return obj.id;
    }
    , remove = function () {

    };

  return{
    insert: insert,
    get: get,
    remove: remove,
    name: interfaceName,
    getInsertId: getInsertId
  };
})();

module.exports = CouchInterface;

