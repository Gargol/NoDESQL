'use strict';

var benchmark = require('../lib/nodesql');

describe('Benchmark Runner', function () {
  var fakeDBInterface = {};

  beforeEach(function () {

    fakeDBInterface = {
      insert: function(){},
      get: function(){},
      remove: function(){}
    };

    spyOn(fakeDBInterface, 'insert');
    spyOn(fakeDBInterface, 'get');
    spyOn(fakeDBInterface, 'remove');

    benchmark.init(fakeDBInterface);
  });

  it('invokes insert methods of the given object', function () {
    benchmark.doWrites();
    expect(fakeDBInterface.insert).toHaveBeenCalled();
  });

  it('writes should invoke only one time whenever no parameters are passed', function () {
    benchmark.doWrites();
    expect(fakeDBInterface.insert.calls.length).toEqual(1);
  });

  it('invokes insert methods of the given object N given times', function () {
    benchmark.doWrites(10);
    expect(fakeDBInterface.insert.calls.length).toEqual(10);
  });

  it('invokes get method whenever reads are executed', function(){
    benchmark.doReads(1);
    expect(fakeDBInterface.get).toHaveBeenCalled();
  });

  it('does only one read in case no parameters are passed', function(){
    benchmark.doReads();
    expect(fakeDBInterface.get.calls.length).toEqual(1);
  });

  it('performs exact amount of reads on the given interface as in parameter', function(){
    benchmark.doReads(100);
    expect(fakeDBInterface.get.calls.length).toEqual(100);
  });
});

