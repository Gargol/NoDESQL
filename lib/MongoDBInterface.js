"use strict";
var Benchmark = Benchmark || {};

Benchmark.MongoClient = require('mongodb').MongoClient;

Benchmark.MongoInterface = function(){
  var client = Benchmark.MongoClient
    , defaultCollectionName = 'documents'
    , insert = function(obj){
      client.connect("mongodb://localhost/documents", function(err, db) {
        if(err){
          return console.dir(err);
        }
        var collection = db.collection(defaultCollectionName);
        collection.insert(obj, {w:1}, function(err, result){
          if(err){
            return err;
          }
          return result;
        });
      });
    }
    , get = function(){

    }
    , remove = function(){

    };

  return{
    insert: insert,
    get: get,
    remove: remove
  };
};