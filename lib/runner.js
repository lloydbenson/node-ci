var Async = require('async');
var Exec = require('child_process').exec;
var SCM = require('./scm');
var Fs = require('fs');
var Notify = require('./notify');
var Utils = require('./utils');

var internals = {};

exports.execute = function(job_id, callback) {
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
//   Fs.exists(file, function(exists) {
//      if (exists) {
//         delete require.cache[file];
//         config = require(file);
//      } else {
//         console.stderr("File not found");
//      }
//   });    

    internals.buildJob(job_id, function (err, job) {

      if (err) {

        callback(err, null);
      }

      else {
          var postExec = function (err, stdout, stderr) {

            //handle any after stuff here, anything can be added

            return null;
          };

          var commands = [

            { command: 'date', options: {}, callback: postExec },
            { command: 'date', options: {}, callback: postExec },
            { command: 'date', options: {}, callback: postExec }
          ];

      }
    });

internals.executeSync = function(section, cmd, consoleFile) {

    // revisit this logic when 0.12 comes out and execSync is built in
    if (!cmd) {
        // error out?
    }
    var fileOutput = '';
    fileOutput += '--------------------' + section + '\n';
    fileOutput += 'running command: "' + cmd + '"\n';
    // Run the command in a subshell
    var blockCommand = cmd + ' 2>&1 1>output && echo done! > done';
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

    fileOutput += output;
    fileOutput += '--------------------' + section + '\n';
    Fs.appendFileSync(consoleFile, fileOutput, 'utf8');

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

    var config = {};
    // replace with getJob?
    Fs.exists(jobFile, function(exists) {

        if (exists) {

            delete require.cache[jobFile];
//            console.log('loading in file: ', jobFile);
            config = require(jobFile);
            //console.log(config)
            Fs.writeFileSync(consoleFile, 'start job: ' + config.name +'\n' , 'utf8');

            // never gets more than the pre job probably missing callback logic
            Async.series([
                function pre(callback) {

                    internals.executeSync('pre', config.pre, consoleFile);
                    callback(null, 'pre');
                },
                function command(callback) {

                    internals.executeSync('command', config.command, consoleFile);
                    callback(null, 'command');
                },
                function post(callback) {

                    internals.executeSync('post', config.post, consoleFile);
                    callback(null, 'post');
                },
                function notify(callback) {
                    var notifyObj = {
                        type: 'email',
                        job_id: 1,
                        run_id: 1,
                        subject: 'test',
                        recipients: [ 'lloydbenson@gmail.com', 'backer@gmail.com' ],
                        body: 'this is a body of text',
                        host: 'localhost',
                        port: 25
                    };
                    var notifyStatus = Notify.notify(notifyObj);
                    var fileOutput = '';
                    fileOutput += '--------------------notify' + '\n';
                    fileOutput += 'notifying "' + notifyObj.recipients + '"\n';
                    fileOutput += JSON.stringify(notifyStatus) + '\n';
                    fileOutput += '--------------------notify' + '\n';
                    Fs.appendFileSync(consoleFile, fileOutput, 'utf8');
                    callback(null, 'notify');
                }], function (err, results) {

                    if (err) {
                       console.log('there was an error: ' + err);
                    }
                    else {

                        Fs.appendFileSync(consoleFile, 'finish job: ' + config.name +'\n', 'utf8');
                    }
            });
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

internals.recurse = function (index, commands) {

  var that = this;

  if(index < commands.length){

    var command = internals.perform(commands[index], function(err, code){

      //finished with the job
      if(!err){
        return internals.recurse(++index, commands);
      }
    });

    return null;
  }

  else {

    return console.log('finished');
  }
}

internals.perform = function (cmd, callback) {

  var command = Exec(cmd.command, cmd.args, cmd.options);

  command.stdout.on('data', function (data) {

    console.log(data.toString());
  });

  command.on('close', function (code) {

    return callback(null, code); 
  });
/*
export.heartbeat = function() {
   // on a timed interval checkin with master and offline if runner is no longer available
   // similarly if functional again online it
   console.log('made it to heartbeat');
>>>>>>> 44453a5dbc1194b01ef7e831d92278b6e6aae26d
};
*/
