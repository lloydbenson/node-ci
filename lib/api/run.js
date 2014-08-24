var Runner = require('../runner');
var Fs = require('fs');
var Utils = require('../utils');

exports.startRun = function (request,reply) {
   // execute job from id and give back status, elapsed time, run id, need to pass optional timeout
   //var job = { pre: "uptime", command: "uptime", post: "uptime" };
   // will need to generate run_id
   var job_id = 1;
   var run_id = 1;
   var runPath = "/tmp/node-ci/job/" + job_id + "/run";
   var runIdPath = runPath + "/" + run_id;
   Utils.mkdirp(runIdPath);
   var runFile = runIdPath + "/run.json";
   var runStream = Fs.createWriteStream(runFile);
   // need callback to make sure runner is going ok
   Runner.start(job_id);
   var response = {
       job_id: request.params.job_id,
       run_id: run_id,
       status: 'running',
       created: new Date().getTime()
   }
   runStream.write(JSON.stringify(response));
   runStream.end();
   reply(response);
};

exports.cancelRun = function (request,reply) {

   // how should i interrupt a job?
   // need to check elapsed time after it has been successfully stopped
   var response = {
       job_id: request.params.job_id,
       run_id: request.params.run_id,
       status: 'cancelled',
       elapsed: 'time',
       created: 'time'
   }
   reply(response);
};

exports.getConsole = function (request, reply) {

    var consolePath = "/tmp/node-ci/job/" + request.params.job_id + "/run/" + request.params.run_id;
    var consoleFile = consolePath + "/console.log";
    // should be a stream that refreshes on an interval?
    var file = Fs.readFileSync(consoleFile, "utf8");
    var response = {
        job_id: request.params.job_id,
        run_id: request.params.run_id,
        console: file
    }
    reply(response);
};

exports.getRun = function (request,reply) {

   var runPath = "/tmp/node-ci/job/" + request.params.job_id + "/run/" + request.params.run_id;
   var runFile = runPath + "/run.json";

   var file = Fs.readFileSync(runFile, "utf8");

//   var elapsed = new Date().getTime() - createDate; 
   reply(file);
};
