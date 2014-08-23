var Async = require('async');
var Exec = require('child_process').exec;
var SCM = require('./scm');
var Fs = require('fs');
var Notify = require('./notify');
var Utils = require('./utils')

var internals = {};

internals.execute = function(section, cmd, fileStream, callback) {

    fileStream.write('starting section: ' + section + '\n');
    fileStream.write('running command: ' + cmd + '\n');
    var command = Exec(JSON.stringify(cmd));
    command.stdout.on('data', function(data) {

        fileStream.write('stdout: ' + data);
    });
    command.stderr.on('data', function(data) {

        fileStream.write('stderr: ' + data);
    });
    command.on('exit', function() {

        fileStream.write('finished command: ' + cmd + '\n');
        fileStream.write('finished section: ' + section + '\n');
        return callback();
//        process.exit();
 //       return callback();
    });
}

exports.start = function(job_id) {
    // run scm
    // should log this to a file and have /console expose the stream
    // should command section should take an object list of commands
    // if its an array, do them in parallel otherwise serially
    // need to research how exec works, seems like i should get a pid or something where i can check status and kill if I want to abort
    var run_id = 1;
    var jobPath = "/tmp/node-ci/job/" + job_id;
    var runPath = jobPath + "/run/" + run_id;

    Utils.mkdirp(jobPath);
    Utils.mkdirp(runPath);

    var jobFile = jobPath + "/config.json";
    var consoleFile = jobPath + "/run/" + run_id + "/console.log";
    var consoleStream = Fs.createWriteStream(consoleFile);

    var config = {};
    Fs.exists(jobFile, function(exists) {

        if (exists) {

            delete require.cache[jobFile];
//            console.log('loading in file: ', jobFile);
            config = require(jobFile);
            //console.log(config);
            Async.waterfall([
                function(callback) {
                    internals.execute('pre', config.pre, consoleStream, callback);
                    //callback();
                },
                function(callback) {
                    internals.execute('command', config.command, consoleStream, callback);
                    //callback();
                },
                function(callback) {
                    internals.execute('post', config.post, consoleStream, callback);
                    //callback();
                },  function(err, result) {

                    console.log('everything is done');
                    //doSomethingOnceAllAreDone();
                }
            ]);
            //internals.execute('pre', config.pre, consoleStream);
            //internals.execute('command', config.command, consoleStream);
            //internals.execute('post', config.post, consoleStream);
            /*
            var command = Exec(JSON.stringify(config.command));
            var post = Exec(JSON.stringify(config.post));

            console.log('pre: ' + pre);

            command.stdout.on('data', function(data) {

                consoleStream.write('command stdout: ' + data);
            });

            command.stderr.on('data', function(data) {

                consoleStream.write('command stderr: ' + data);
            });

            command.on('close', function (code) {

                if (code == 0) {

                //           console.log('finished successfully...');
                //           return callback(null, 'command');
                }
                else {

                    process.exit(code);
                }
            });

            post.stdout.on('data', function(data) {

                consoleStream.write('post stdout: ' + data);
            });

            post.stderr.on('data', function(data) {

                consoleStream.write('post stderr: ' + data);
            });

            post.on('close', function (code) {

                if (code == 0) {

        //           console.log('finished successfully...');
        //           return callback(null, 'post');
                }
                else {

                   process.exit(code);
                }
            });
*/
            var notify = {
                type: 'email',
                job_id: 1,
                run_id: 1,
                subject: 'test',
                recipients: [ 'lloydbenson@gmail.com', 'backer@gmail.com' ],
                body: 'this is a body of text',
                host: 'localhost',
                port: 25
            };
            //var status = Notify(notify);
            //console.log('status: ' + status);

        } else {

            console.stderr("File not found");
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
