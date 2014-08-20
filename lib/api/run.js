var Runner = require('../runner');

exports.startRun = function (request,reply) {
   // execute job from id and give back status, elapsed time, run id, need to pass optional timeout
   //var job = { pre: "uptime", command: "uptime", post: "uptime" };
   var job = { pre: "date", command: "date", post: "date" };
   var job_id = 1;
   Runner.execute(job_id);
   var response = {
       job_id: request.params.job_id,
       run: {
           run_id: 1,
           status: 'running',
           created: 'time'
       }
   }
   reply(response);
};

exports.cancelRun = function (request,reply) {

   var response = {
       job_id: request.params.job_id,
       run: {
           run_id: request.params.run_id,
           status: 'cancelled',
           elapsed: 'time',
           created: 'time'
       }
   }
   reply(response);
};

exports.getConsole = function (request,reply) {

   var response = {
       job_id: request.params.job_id,
       run_id: request.params.run_id,
       console: 'some output'
   }
   reply(response);
};

exports.getRun = function (request,reply) {

   var response = {
       job_id: request.params.job_id,
       run: {
           run_id: request.params.run_id,
           status: 'running',
           elapsed: 'time',
           created: 'time'
       }
   }
   reply(response);
};
