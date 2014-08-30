var Async = require('async');
var Exec = require('child_process').exec;
var SCM = require('./scm');
var Fs = require('fs');
var Notify = require('./notify');
var Store = require('./store/file');

var internals = {};

internals.executeSync = function(job_id, run_id, section, cmd) {

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
    //Fs.appendFileSync(consoleFile, fileOutput, 'utf8');
    Store.saveConsoleLog(job_id, run_id, fileOutput);

}

exports.start = function(job_id) {
    // run scm
    // should log this to a file and have /console expose the stream
    // should command section should take an object list of commands
    // if its an array, do them in parallel otherwise serially
    // need to research how exec works, seems like i should get a pid or something where i can check status and kill if I want to abort
    var run_id = 1;
    var config = Store.getJobConfig(job_id, run_id);
    Store.saveConsoleLog(job_id, run_id, 'start job: ' + config.name +'\n');
    /*
    var postExec = function (err, stdout, stderr) {

            //handle any after stuff here, anything can be added

            return null;
    };
    internals.recurse(job_id, run_id, 0, [
     { command: config.pre, options: {}, callback: postExec },
     { command: config.command, options: {}, callback: postExec },
     { command: config.post, options: {}, callback: postExec }
    ]);
    */
    Async.series([
        function checkout(callback) {

            var status = SCM.checkout(config.scm);
            var fileOutput = '';
            fileOutput += '--------------------scm' + '\n';
            fileOutput += JSON.stringify(status) + '\n';
            fileOutput += '--------------------scm' + '\n';
            Store.saveConsoleLog(job_id, run_id, fileOutput);     
            callback(null, 'scm');
        },
        function pre(callback) {

            internals.executeSync(job_id, run_id, 'pre', config.pre);
            callback(null, 'pre');
        },
        function command(callback) {

            internals.executeSync(job_id, run_id, 'command', config.command);
            callback(null, 'command');
        },
        function post(callback) {

            internals.executeSync(job_id, run_id, 'post', config.post);
            callback(null, 'post');
        },
        function notify(callback) {    
            var notifyObj = {
                type: 'email',
                job_id: job_id,
                run_id: run_id,
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
            Store.saveConsoleLog(job_id, run_id, fileOutput);     
            callback(null, 'notify');
        }], function (err, results) {

            if (err) {
                console.log('there was an error: ' + err);
            }
            else {

                Store.saveConsoleLog(job_id, run_id, 'finish job: ' + config.name +'\n');
            }
    });
//   Store.saveConsoleLog(job_id, run_id, 'finish job: ' + config.name +'\n');
};

exports.registerQueue = function() {

   // register with master job runner and register the queue name if it doesnt exist
   // by default it will just register with "global" queue
   console.log('made it to registerQueue');
};

/*

internals.recurse = function (job_id, run_id, index, commands) {

  var that = this;

  if(index < commands.length){
    var command = internals.perform(job_id, run_id, commands[index], function(err, code){

      //finished with the job
      if(!err){
        return internals.recurse(job_id, run_id, ++index, commands);
      }
    });

    return null;
  }

  else {

    return console.log('finished');
  }
}

internals.perform = function (job_id, run_id, cmd, callback) {

  
  var command = Exec(cmd.command, cmd.args, cmd.options);
  command.stdout.on('data', function (data) {

    Store.saveConsoleLog(job_id, run_id, data.toString());
  });

  command.on('close', function (code) {

    return callback(null, code); 
  });

  command.stderr.on('data', function (data) {

    Store.saveConsoleLog(job_id, run_id, 'ERROR: '  + data.toString());
  });
}
*/