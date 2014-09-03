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
        var stat = Fs.lstatSync(filename);
//        if (filename == "." || filename == "..") {
            // pass these files
//        }
//        else if (stat.isDirectory()) {
        if (stat.isDirectory()) {

            // rmdir recursively
            internals.rmdirFull(filename);
        }
        else {
           // rm fiilename
           //if (filename.match('^/tmp/node-ci')) {
               //console.log('removing file: ' + filename);
               Fs.unlinkSync(filename);
           //}
        }
    }
    //if (dir.match('^/tmp/node-ci')) {
        //onsole.log('removing dir: ' + dir);
        Fs.rmdirSync(dir);
    //}
};

exports.getDirs = function (dirpath) {

    var list = Fs.readdirSync(dirpath);
    var dirs = [];
    for(var i = 0; i < list.length; i++) {

        var filename = Path.join(dirpath, list[i]);
        var stat = Fs.lstatSync(filename);
//        if (filename == "." || filename == "..") {
            // pass these files
//        }
//        else if (stat.isSymbolicLink()) {
        if (stat.isSymbolicLink()) {
            // rmdir recursively
            // we don't care about symlinks
            //console.log('symlink: ' + filename);
        }
        else if (stat.isDirectory()) {
            // rmdir recursively
            //console.log('job: ' + filename);
            var path = filename.split('/');
	          var dir = path[path.length-1];
            dirs.push(dir);
        }
        else {
           // we dont care about files
           //console.log('filename: ' + filename);
        }
    }
    //console.log('jobs: ', jobs);
    return dirs;
};

exports.getJobs = function () {

    var jobPath = internals.defaults.mainPath + '/' + internals.defaults.jobPath;
    var jobs = this.getDirs(jobPath);
    return jobs;
};

exports.getRuns = function (job_id) {

    var runPath = internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + job_id + '/' + internals.defaults.runPath;
    var runs = this.getDirs(runPath);
    return runs;
};

exports.saveJobConfig = function(config, job_id) {

   if (! config.command ) {
       var err = 'command is required';
       return { job_id: null, err: err }

   }
   var jobPath = null;
   if (job_id == null) {

       job_id = Uuid.v4();
       jobPath = internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + job_id;
       internals.mkdirp(jobPath + '/' + internals.defaults.runPath);
       internals.mkdirp(jobPath + '/' + internals.defaults.workspacePath);
       Fs.symlinkSync(jobPath, internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + config.name);
   }
   else {
       jobPath = internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + job_id;
       Fs.symlinkSync(jobPath, internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + config.name);
   }
   var file = jobPath + '/' + internals.defaults.configFile;
   //console.log('saving file: ' + file);
   Fs.writeFileSync(file,JSON.stringify(config,null,4));
   return { job_id: job_id };
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

exports.deleteJobLabel = function (job_id) {

    var jobPath = internals.defaults.mainPath + '/' + internals.defaults.jobPath;
    var jobIdPath = jobPath + '/' + job_id;
    var config = this.getJobConfig(job_id);
    //console.log('removing symlink: ' + config.name);
    Fs.unlinkSync(jobPath + '/' + config.name);
};

exports.saveRunConfig = function (job_id, run_id, status) {

   var runPath = internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + job_id + '/' + internals.defaults.runPath + '/' + run_id;
   internals.mkdirp(runPath);
   var runFile = runPath + '/' + internals.defaults.runFile;
   var config = {
       job_id: job_id,
       run_id: run_id,
       status: status
   }
   if (status === 'succeeded' || status === 'failed' || status === 'aborted') {
       config.finishTime = new Date().getTime();
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

exports.setRunLabel = function (job_id, run_id, label) {

	var runPath = internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + job_id + '/' + internals.defaults.runPath;
	var runIdPath = runPath + '/' + run_id;
	var labelPath = runPath + '/' + label;
	if (Fs.existsSync(labelPath)) {
        Fs.unlinkSync(labelPath);
        Fs.symlinkSync(runIdPath, labelPath);
	}
	else {
        Fs.symlinkSync(runIdPath, labelPath);
	}
};

exports.getRunByLabel = function (job_id, label) {
	var runPath = internals.defaults.mainPath + '/' + internals.defaults.jobPath + '/' + job_id + '/' + internals.defaults.runPath;
	var runIdPath = runPath + '/' + run_id;
	var labelPath = runPath + '/' + label;
	if (Fs.existsSync(labelPath)) {
	    var namePath = Fs.readlinkSync(labelPath);
	    var run = namePath.split('/');
	    var run_id = run[run.length-1];
	    return run_id;
	} 
	else {
		return null;
	}
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