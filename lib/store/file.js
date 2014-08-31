var Fs = require('fs');
var Path = require('path');
var Uuid = require('node-uuid');

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
        else if (stat.isDirectory()) {
            // rmdir recursively
            internals.rmdirFull(filename);
        }
        else {
           // rm fiilename
           if (filename.match('^/tmp/node-ci')) {
               //console.log('removing file: ' + filename);
               Fs.unlinkSync(filename);
           }
        }
    }
    if (dir.match('^/tmp/node-ci')) {
        //onsole.log('removing dir: ' + dir);
        Fs.rmdirSync(dir);
    }
};

exports.getJobs = function () {

    var jobPath = internals.defaults.mainPath + '/' + internals.defaults.jobPath;
    var list = Fs.readdirSync(jobPath);
    var jobs = [];
    for(var i = 0; i < list.length; i++) {

        var filename = Path.join(jobPath, list[i]);
        var stat = Fs.statSync(filename);
        if (filename == "." || filename == "..") {
            // pass these files
        }
        else if (stat.isDirectory()) {
            // rmdir recursively
            console.log('job: ' + filename);
            jobs.push(filename);
        } else {
           // we dont care about files
        }
    }
    console.log('jobs: ', jobs);
    return jobs;
};

exports.saveJobConfig = function(config) {

//   var job_id = 1;
   // make sure symlink doesn't exist yet else err
   // skip for now
   var job_id = Uuid.v4();
   // need full path here
   var jobPath = internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + job_id;
   internals.mkdirp(jobPath + '/' + internals.defaults.runPath);
   internals.mkdirp(jobPath + '/' + internals.defaults.workspacePath);
   var file = jobPath + '/' + internals.defaults.configFile;
   //console.log('saving file: ' + file);
   Fs.writeFileSync(file,JSON.stringify(config,null,4));
   Fs.symlinkSync(jobPath, internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + config.name);
   return job_id;
};

exports.getJobConfig = function (job_id) {

    var jobFile = internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + job_id + '/' + internals.defaults.configFile;
    var config = Fs.readFileSync(jobFile, "utf8");
    return JSON.parse(config);
};

exports.getJobConfigByName = function (name) {
	var namePath = internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + name;
	var jobPath = Fs.readlinkSync(namePath);
	var job = jobPath.split('/');
	var job_id = job[job.length-1];
	return job_id;
}

exports.deleteJob = function (job_id) {

    var jobPath = internals.defaults.mainPath + '/' + internals.defaults.jobPath;
    var jobIdPath = jobPath + '/' + job_id;
    var config = this.getJobConfig(job_id);
    internals.rmdirFull(jobIdPath);
    //console.log('removing symlink: ' + config.name);
    Fs.unlinkSync(jobPath + '/' + config.name);
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