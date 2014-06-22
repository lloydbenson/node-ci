exports.getJobs = function (request,reply) {

   var jobs = [1,2];
   reply(jobs);
};

exports.createJob = function (request,reply) {

   var job = {
       name: request.payload.name,
       scm: {
          scm_type: 'github',
          entry: 'git@github.com:lloydbenson/node-ci',
          branch_type: 'pr',
          branch: 'origin/master'
       },
       command: {},
       runs: [{}],
       created: 'time',
       updated: 'time'
   };

   var job_id = 1;

   var response = {
       job_id: job_id,
       statusCode: 200,
       message: 'created'
   };
   reply(response);
};

exports.deleteJob = function (request,reply) {

   var response = {
       job_id: request.params.job_id,
       statusCode: 200,
       message: 'deleted'
   };
   reply(response);
};

exports.updateJob = function (request,reply) {
   var response = {
       job_id: request.params.job_id,
       statusCode: 200,
       message: 'updated'
   };
   reply(response);
};

exports.getJob = function (request,reply) {

   var response = {
       job_id: request.params.job_id,
       name: 'name',
       scm: {},
       command: {},
       runs: [{}],
       created: 'time',
       updated: 'time'
   };
       
   reply(response);
};

exports.startRun = function (request,reply) {
   // execute job from id and give back status, elapsed time, run id, need to pass optional timeout
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
