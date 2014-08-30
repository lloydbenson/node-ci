var Fs = require('fs');

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