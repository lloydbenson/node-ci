var Child = require('child_process');
var SCM = require('./scm');
var Fs = require('fs');
var Notify = require('./notify');

exports.execute = function(job_id) {
    // run scm
    // run notify
    // async
    // should log this to a file and have /console expose the stream
    // should command section should take an object list of commands
    // if its an array, do them in parallel otherwise serially
    // need to research how exec works, seems like i should get a pid or something where i can check status and kill if I want to abort
    // maybe need spawn vs exec?
    var jobFile = "/tmp/node-ci/job/" + job_id + "/config.json";
    var run_id = 1;
    var consoleFile = "/tmp/node-ci/job/" + job_id + "/run/" + run_id + "/console.log";
    var consoleStream = Fs.createWriteStream(consoleFile);

    var config = {};
    Fs.exists(jobFile, function(exists) {

        if (exists) {

            delete require.cache[jobFile];
//            console.log('loading in file: ', jobFile);
            config = require(jobFile);
            //console.log(config);
            var pre = Child.exec(JSON.stringify(config.pre));
            var command = Child.exec(JSON.stringify(config.command));
            var post = Child.exec(JSON.stringify(config.post));

            pre.stdout.on('data', function(data) {

                consoleStream.write('pre stdout: ' + data);
            });

            pre.stderr.on('data', function(data) {

                consoleStream.write('pre stderr: ' + data);
            });

            pre.on('close', function (code) {

                if (code == 0) {

                   //console.log('finished successfully...');
        //           return callback(null, 'pre');
                }
                else {

                   process.exit(code);
                }
            });

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
            //console.log(post);

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
