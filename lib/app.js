var benchmark = require('./nodesql')
  , Q = require('q')
  , mongo = require('./MongoDBInterface')
  , couch = require('./CouchDBInterface')
  , rethink = require('./RethinkDBInterface')
  , dataProvider = require('./dataProvider')
  ;

benchmark.init(mongo, dataProvider);

Q.fcall(function(){
  return true;
})
  .then(function(){
    return benchmark.doWrites(1000);
  })
  .then(function (value) {
    console.log('Previous operation finished with status: ' + value);
    return benchmark.doReads(1000);
  });

benchmark.init(couch, dataProvider);

Q.fcall(function(){
    return true;
})
  .then(function(){
    return benchmark.doWrites(1000);
  })
  .then(function (value) {
    console.log('Previous operation finished with status: ' + value);
    return benchmark.doReads(1000);
  });


benchmark.init(rethink, dataProvider);
Q.fcall(function(){
    return true;
})
  .then(function(){
    console.log('Starting write operations chain');
    return benchmark.doWrites(1000);
  })
  .then(function (value) {
    console.log('Previous operation finished with status: ' + value);
    return benchmark.doReads(1000);
  }, function(error){
    console.log('something very wrong has happened' + error);
  });

