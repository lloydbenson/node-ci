var Spawn = require('child_process').spawn;
var SCM = require('./scm');
var Fs = require('fs');

var internals = {};

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
   // console.log(config);    
    //console.log(config);

    var execCallback = function (err, stdout, stderr) {

      console.log('blerp!');
    }
    
    // var pre = Child.exec(JSON.stringify(config.pre));
    // var command = Child.exec(JSON.stringify(config.command));
    // var post = Child.exec(JSON.stringify(config.post));

    var commands = [

      { command: 'date', options: {}, callback: execCallback },
      { command: 'date', options: {}, callback: execCallback },
      { command: 'date', options: {}, callback: execCallback }
    ];

    return internals.recurse(0, commands);
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

internals.recurse = function (index, commands) {

  console.log('oh hallo')

  var that = this;

  if(index < commands.length){

    var command = internals.perform(commands[index], function(err, code){

      //finished with the job
      if(!err){
        return (internals.recurse(++index, commands));
      }
    });

    return('not finished yet!');
  }

  else {

    return(console.log('finished'));
  }
}

internals.perform = function (cmd, callback) {

  var that = this;

  var command = Spawn(cmd.command, cmd.args, cmd.options);

  command.stdout.on('data', function (data) {

    console.log(data);
  });

  command.on('close', function (code) {

    callback(null, code); 
  });

  return null;
};
