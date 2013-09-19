/*
 * NoDESQL
 * nazargargol.com
 *
 * Copyright (c) 2013 Nazar Gargol
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Does CRUD operations on given database interface provider
 * and handles all the time measurements
 * @returns {{init: Function, doWrites: Function, doReads: Function, doDeletes: Function}}
 * @constructor
 */
var CommandExecutionProxy = (function () {
  var _db
    , init = function (dbInterface) {
      _db = dbInterface;
    }
  /**
   * Writes n random elements to the database
   */
    , doWrites = function (n) {
      n = n || 1;
      for (var i = 0; i < n; i++) {
        _db.insert({hello: "World"});
      }
    }
  /**
   * Does read operation n times on a given interface
   */
    , doReads = function (n) {
      n = n || 1;
      for (var i = 0; i < n; i++) {
        _db.get();
      }

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

module.exports = CommandExecutionProxy;
