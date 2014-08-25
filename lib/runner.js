var Exec = require('child_process').spawn;
var SCM = require('./scm');
var Fs = require('fs');

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

    return internals.recurse(0, commands);
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
};
