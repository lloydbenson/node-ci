var Fs = require('fs');
var Path = require('path');

var internals = {
    defaults: {
        configFile: 'config.json',
        consoleFile: 'console.log',
        runFile: 'run.json',
        mainPath: '/tmp/node-ci',
        jobPath: 'job',
        runPath: 'run',
        workspacePath: 'workspace' 
    }
};

internals.mkdirp = function (dirpath) {
  
  var parts = dirpath.split('/');
  for ( var i = 2; i <= parts.length; i++ ) {

    var dir = parts.slice(0, i).join('/');
    if ( ! Fs.existsSync(dir) ) {
       
            //console.log('making dir: ' + dir);
        	Fs.mkdirSync ( dir );
    }
  }
}

internals.rmdirFull = function(dir) {
	// works but makes me nervous, want to maybe do a validation here so it doesnt get too far away from me
	// in many cases I can be careful, but not sure how to safely remove all of scm dir for example
	// get advice from backer
	// for now just pretend via comment
	// definitely want joi validation to make sure we have valid strings etc
    var list = Fs.readdirSync(dir);
    for(var i = 0; i < list.length; i++) {

        var filename = Path.join(dir, list[i]);
        var stat = Fs.statSync(filename);
        if (filename == "." || filename == "..") {
            // pass these files
        }
        else if(stat.isDirectory()) {
            // rmdir recursively
            internals.rmdirFull(filename);
        } else {
           // rm fiilename
           console.log('removing file: ' + filename);
           //Fs.unlinkSync(filename);
        }
    }
    console.log('removing dir: ' + dir);
    //Fs.rmdirSync(dir);
};

exports.saveJobConfig = function(config) {

   var job_id = 1;
   var jobPath = internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + job_id;
   internals.mkdirp(jobPath + '/' + internals.defaults.runPath);
   internals.mkdirp(jobPath + '/' + internals.defaults.workspacePath);
   var file = jobPath + '/' + internals.defaults.configFile;
   //console.log('saving file: ' + file);
   Fs.writeFileSync(file,JSON.stringify(config,null,4));
   return job_id;
};

exports.getJobConfig = function (job_id) {

    var jobFile = internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + job_id + '/' + internals.defaults.configFile;
    var config = Fs.readFileSync(jobFile, "utf8");
    return JSON.parse(config);
};

exports.deleteJob = function (job_id) {

    var jobPath = internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + job_id;
    internals.rmdirFull(jobPath);
};

exports.saveRunConfig = function (job_id, run_id) {

   var runPath = internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + job_id + '/' + internals.defaults.runPath + '/' + run_id;
   internals.mkdirp(runPath);
   var runFile = runPath + '/' + internals.defaults.runFile;
   var config = {
       job_id: job_id,
       run_id: run_id,
       status: 'running',
       created: new Date().getTime()
   }
   Fs.writeFileSync(runFile, JSON.stringify(config,null,4));
   return config;
};

exports.getRunConfig = function (job_id, run_id) {

   var runPath = internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + job_id + '/' + internals.defaults.runPath + '/' + run_id;
   var runFile = runPath + '/' + internals.defaults.runFile;
   var config = Fs.readFileSync(runFile, "utf8");
   return JSON.parse(config);
};

exports.deleteRun = function (job_id, run_id) {

   var runPath = internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + job_id + '/' + internals.defaults.runPath + '/' + run_id;
   internals.rmdirFull(runPath);
};

exports.saveConsoleLog = function (job_id, run_id, output) {

   var runPath = internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + job_id + '/' + internals.defaults.runPath + '/' + run_id;
   var consoleFile = runPath + '/' + internals.defaults.consoleFile;
   Fs.appendFileSync(consoleFile, output, 'utf8');
};

exports.getConsoleLog = function (job_id, run_id) {

   var runPath = internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + job_id + '/' + internals.defaults.runPath + '/' + run_id;
   var consoleFile = runPath + '/' + internals.defaults.consoleFile;
   var file = Fs.readFileSync(consoleFile, 'utf8');
   return file;
};