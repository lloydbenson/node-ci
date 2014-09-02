var Exec = require('child_process').execSync;
var SCM = require('./scm');
var Fs = require('fs');
var Notify = require('./notify');
var Store = require('./store/file');
var Uuid = require('node-uuid');

var internals = {};

internals.executeSync = function(job_id, run_id, section, cmd) {

    // revisit this logic when 0.12 comes out and execSync is built in
    if (!cmd) {
        // error out?
    }
    var err = null;
    var fileOutput = '';
    fileOutput += '--------------------' + section + '\n';
    fileOutput += 'running command: "' + cmd + '"\n';
    try {
       var executer  = Exec(cmd, {encoding: 'utf8'} );
    }
    catch (error) {
        err =  error;
    }
    if (err) {
        fileOutput += err;
    }
    else {
        fileOutput += executer;
    }
    fileOutput += '--------------------' + section + '\n';
    Store.saveConsoleLog(job_id, run_id, fileOutput);
    return err;
}

exports.start = function(job_id) {
    // run scm
    // should log this to a file and have /console expose the stream
    // should command section should take an object list of commands
    // if its an array, do them in parallel otherwise serially
    // need to research how exec works, seems like i should get a pid or something where i can check status and kill if I want to abort
    //var run_id = 1;
    var jobConfig = Store.getJobConfig(job_id);
    var run_id = new Date().getTime();
    var runConfig = Store.saveRunConfig(job_id, run_id);
    var err = null;
    var errSection = null;
    Store.setRunLabel(job_id, run_id, 'latest');
    //console.log('starting run_id: ' + run_id);
    Store.saveConsoleLog(job_id, run_id, 'start job: ' + jobConfig.name +'\n');
    /*
    var postExec = function (err, stdout, stderr) {

            //handle any after stuff here, anything can be added

            return null;
    };
   */
   err = SCM.checkout(jobConfig.scm);
   if (err) {
       errSection = 'scm'; 
   }
   var fileOutput = '';
   fileOutput += '--------------------scm' + '\n';
   fileOutput += JSON.stringify(err) + '\n';
   fileOutput += '--------------------scm' + '\n';
   Store.saveConsoleLog(job_id, run_id, fileOutput);    
   var sections = [];
   if (jobConfig.pre) {
       sections.push({ section: 'pre', cmd: jobConfig.pre}); 
   }
   if (jobConfig.command) {
       sections.push({ section: 'command', cmd: jobConfig.command}); 
   }
   else {
       console.log('handle no command set');
   }
   if (jobConfig.post) {
       sections.push({ section: 'post', cmd: jobConfig.post}); 
   }
   err = internals.recurse(job_id, run_id, 0, sections);
   if (err) {
       errSection = 'sections'; 
   }

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
    if (!err) {
        Store.saveConsoleLog(job_id, run_id, 'successful finish: ' + jobConfig.name +'\n');
        Store.setRunLabel(job_id, run_id, 'success');
    }
    else {
        Store.saveConsoleLog(job_id, run_id, 'failed section: ' + errSection + ' with err '+ err + '\n');        
        Store.saveConsoleLog(job_id, run_id, 'unsuccessful finish: ' + jobConfig.name + '\n');
        //Store.setRunLabel(job_id, run_id, 'unsuccess');
    }
    return run_id;
};

exports.registerQueue = function() {

   // register with master job runner and register the queue name if it doesnt exist
   // by default it will just register with "global" queue
   console.log('made it to registerQueue');
};

internals.recurse = function (job_id, run_id, index, commands) {

    var that = this;
    var err = null;
    if (index < commands.length) {
        //console.log('running: ' + commands[index].cmd);
        err = internals.executeSync(job_id, run_id, commands[index].section, commands[index].cmd);
        if (!err) {
            return internals.recurse(job_id, run_id, ++index, commands);
        }
        else {
            return err;
        }
    }
    else {
        //console.log('finished');
        return null;
    }
}

/*
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