var Async = require('async');
var Child = require('child_process');
var SCM = require('./scm');

exports.run = function(job) {
    // run scm
    // run pre
    // run command
    // run post
    // run notify
    // async
    // should log this to a file and have /console expose the stream
    // should command section should take an object list of commands
    // if its an array, do them in parallel otherwise serially
    Async.waterfall([
       function(callback){
           SCM.checkout(job.scm);
           callback(null, 'scm');
       },
       function(callback){
           // if args need to split to an array
           var pre = Child.spawn(job.pre));
           pre.stdout.on('data', function() {
               console.log('stdout: ' + data);
           });
           pre.stderr.on('data', function() {
               console.log('stderr: ' + data);
           });

           pre.on('close', function (code) {
               if (code == 0) {
                  return callback(null, 'pre');
               }
               else {
                  process.exit(code);
               }
           });
       },
    ], function (err, result) {
        // result now equals 'done'
        if (err) {
            console.log(err);
        }
    });
};

exports.registerQueue = function() {

   // register with master job runner and register the queue name if it doesnt exist
   // by default it will just register with "global" queue

}

export.heartbeat = function() {
   // on a timed interval checkin with master and offline if runner is no longer available
   // similarly if functional again online it
}


