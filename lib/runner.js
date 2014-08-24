var Async = require('async');
var Exec = require('child_process').exec;
var SCM = require('./scm');
var Fs = require('fs');
var Notify = require('./notify');
var Utils = require('./utils');

var internals = {};

internals.executeSync = function(section, cmd, fileStream) {

    // revisit this logic when 0.12 comes out and execSync is built in
    //console.log(fileStream);

    if (!cmd) {
        // error out?
    }
    // Run the command in a subshell
    var blockCommand = cmd + ' 2>&1 1>output && echo done! > done';
    fileStream.write('starting section: ' + section + '\n');
    fileStream.write('running command: ' + cmd + '\n'); 
    Exec(blockCommand);
 
    // Block the event loop until the command has executed.
    while (!Fs.existsSync('done')) {
        // Do nothing
    }
 
    // Read the output
    var output = Fs.readFileSync('output');

    // Delete temporary files.
    Fs.unlinkSync('output');
    Fs.unlinkSync('done');

    fileStream.write(output);
    console.log('output: ' + output);
    fileStream.write('finishing section: ' + section + '\n');
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
            consoleStream.write('starting job: ' + config.name +'\n');
            // never gets more than the pre job probably missing callback logic
            Async.series([
                function pre(callback) {

                    internals.executeSync('pre', config.pre, consoleStream);
                    callback();
                },
                function command(callback) {
                    internals.executeSync('command', config.command, consoleStream);
                    callback();
                },
                function post(callback) {

                    internals.executeSync('post', config.post, consoleStream);
                    callback();
                }], function (err, results) {

                    if (err) {
                       console.log('there was an error: ' + err);
                    }
                    else {
                        consoleStream.write('finishing job\n');
                        consoleStream.end();
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
