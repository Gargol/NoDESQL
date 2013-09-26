"use strict";

var MongoClient = require('mongodb').MongoClient;

var MongoInterface = (function () {
  var interfaceName = 'mongo'
    , client = MongoClient
    , connectionURL = "mongodb://192.168.1.113/documents"
    , defaultCollectionName = 'documents'
    , insert = function (obj, callback) {
      client.connect(connectionURL, function (err, db) {
        if (err) {
          return console.dir(err);
        }
        var collection = db.collection(defaultCollectionName);
        collection.insert(obj, {w: 1}, function (err, result) {
          db.close();
          callback(err, result);
        });
      });
    }
    , get = function (id, callback) {
      client.connect(connectionURL, function (err, db) {
        if (err) {
          return console.dir(err);
        }
        var collection = db.collection(defaultCollectionName);
        collection.find({"_id": id}, function (err, results) {
          callback(err, results);
        });
      });
    }
    , getInsertId = function(obj){
      return obj.result[0]._id;
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
}());

module.exports = MongoInterface;