var Child = require('child_process');
var SCM = require('./scm');
var Fs = require('fs');

exports.execute = function(job_id) {
    // run scm
    // run pre
    // run command
    // run post
    // run notify
    // async
    // should log this to a file and have /console expose the stream
    // should command section should take an object list of commands
    // if its an array, do them in parallel otherwise serially

//   var file="/tmp/job_"+job_id+".json";
   var config = {};
//   Fs.exists(file, function(exists) {
//      if (exists) {
//         delete require.cache[file];
//         config = require(file);
//      } else {
//         console.stderr("File not found");
//      }
//   });    
   config.pre = 'date';
   config.command = 'date';
   config.post = 'date';
   console.log(config);    
    //console.log(config);
    
    var pre = Child.exec(JSON.stringify(config.pre));
    var command = Child.exec(JSON.stringify(config.command));
    var post = Child.exec(JSON.stringify(config.post));

    pre.stdout.on('data', function(data) {

        console.log('pre stdout: ' + data);
    });

    pre.stderr.on('data', function(data) {

        console.log('pre stderr: ' + data);
    });

    pre.on('close', function (code) {

        if (code == 0) {

           //console.log('finished successfully...');
//           return callback(null, 'pre');
        }
        else {
           console.log('exiting...');
           process.exit(code);
        }
    });

    command.stdout.on('data', function(data) {

        console.log('command stdout: ' + data);
    });

    command.stderr.on('data', function(data) {

        console.log('command stderr: ' + data);
    });

    command.on('close', function (code) {

        if (code == 0) {

//           console.log('finished successfully...');
//           return callback(null, 'command');
        }
        else {
           console.log('exiting...');
           process.exit(code);
        }
    });

    post.stdout.on('data', function(data) {

        console.log('post stdout: ' + data);
    });

    post.stderr.on('data', function(data) {

        console.log('post stderr: ' + data);
    });

    post.on('close', function (code) {

        if (code == 0) {

//           console.log('finished successfully...');
//           return callback(null, 'post');
        }
        else {
           console.log('exiting...');
           process.exit(code);
        }
    });
};

exports.registerQueue = function() {

   // register with master job runner and register the queue name if it doesnt exist
   // by default it will just register with "global" queue
   console.log('made it to registerQueue');
};

/*
export.heartbeat = function() {
   // on a timed interval checkin with master and offline if runner is no longer available
   // similarly if functional again online it
   console.log('made it to heartbeat');
};
*/
