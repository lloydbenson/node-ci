var Runner = require('../runner');
var Fs = require('fs');

exports.startRun = function (request,reply) {
   // execute job from id and give back status, elapsed time, run id, need to pass optional timeout
   //var job = { pre: "uptime", command: "uptime", post: "uptime" };
   // will need to generate run_id
   var job_id = 1;
   var run_id = 1;
   var runPath = "/tmp/node-ci/job/" + job_id + "/run/" + run_id + "/run.json";
   var runStream = Fs.createWriteStream(runPath);
   // need callback to make sure runner is going ok
   Runner.execute(job_id);
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

    var consolePath = "/tmp/node-ci/job/" + request.params.job_id + "/run/" + request.params.run_id + "/console.log";
    // should be a stream that refreshes on an interval?
    var consoleFile = Fs.readFileSync(consolePath, "utf8");
    var response = {
        job_id: request.params.job_id,
        run_id: request.params.run_id,
        console: consoleFile
    }
    reply(response);
};

exports.getRun = function (request,reply) {

   var runPath = "/tmp/node-ci/job/" + request.params.job_id + "/run/" + request.params.run_id + "/run.json";
   var runFile = Fs.readFileSync(runPath, "utf8");

//   var elapsed = new Date().getTime() - createDate; 
   reply(runFile);
};
