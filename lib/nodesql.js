/*
 * NoDESQL
 * nazargargol.com
 *
 * Copyright (c) 2013 Nazar Gargol
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs')
  , Q = require('q')
  , moment = require('moment')

/**
 * Does CRUD operations on given database interface provider
 * and handles all the time measurements
 * @returns {{init: Function, doWrites: Function, doReads: Function, doDeletes: Function}}
 * @constructor
 */
var NoDESQL = (function () {
  var _db
    , _ids = []
    , _insertTimeLog = ''
    , _readTimeLog = ''
    , _idsStorageFilename = ''
    , _totalExecTime = {}
    , _repeats
  /**
   * Benchmark initialization base on provided interface
   * @param dbInterface
   */
    , init = function (dbInterface) {
      var now = moment().format('MMM-Do-YYYY');
      _insertTimeLog = now + '-insert-time-' + dbInterface.name + '.csv';
      _readTimeLog = now + '-read-time-' + dbInterface.name + '.csv';
      _idsStorageFilename = now + '-ids-' + dbInterface.name + '.csv';
      _db = dbInterface;
    }
  /**
   * Writes n random elements to the database
   */
    , doWrites = function (n) {
      _repeats = n || 1;
      var d = Q.defer();
      console.log("Starting insert operation for ==" + n +"== operations");
      _totalExecTime = process.hrtime();

      return insert(_repeats, null);
    }
    , insert = function (i, d) {
//      console.log('starting INSERT #'+i);
      var d = d || Q.defer();

      var t = process.hrtime();
      _db.insert({hello: "World"}, function (err, result) {
        console.log('finished INSERT #'+i);
        var insertTime = process.hrtime(t);
        fs.appendFileSync(_insertTimeLog, insertTime.toString()+';\n', 'utf8');
//        console.log('insert took:' + insertTime);

//        console.log(result[0]._id.toString());

        var documentID = _db.getInsertId(result);
        _ids.push(documentID);
        fs.appendFileSync(_idsStorageFilename, documentID + '\n', 'utf8');
        if (err) {
          return console('error while inserting record' + err);
        }

        _repeats--;
        if(_repeats){
          insert(_repeats, d);
        }else{
          console.log('finished performing inserts');
          console.log('total execution time: ' + process.hrtime(_totalExecTime));
          d.resolve(true);
        }
      });

      return d.promise;
    }
  /**
   * Does read operation n times on a given interface
   */
    , doReads = function (n) {
      n = n || 1;
      for (var i = 0; i < n; i++) {
        read(_ids[i]);
      }

    }
    , read = function (id) {
      var t = process.hrtime();
      _db.get(id, function (err, result) {
        var insertTime = process.hrtime(t);
        fs.appendFileSync(_readTimeLog, insertTime.toString()+';\n', 'utf8');
        console.log('read took: ' + insertTime);
        if (err) {
          console.dir(err);
        }
        console.dir(result);
      });
    }
  /**
   * Deletes n random objects from the database
   */
    , doDeletes = function () {
      // not needed at the moment
    };

  return {
    init: init,
    doWrites: doWrites,
    doReads: doReads,
    doDeletes: doDeletes
  };
}());

module.exports = NoDESQL;
