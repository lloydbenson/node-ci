var Fs = require('fs');

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
          // if you have this it will automatically do a run for every pr
          // need to include it in git because pr is a more specific concept
          include_prs: true,
          branch: 'origin/master'
       },
       pre: request.payload.pre,
       command: request.payload.command,
       post: request.payload.post,
/*
       commands: [
          [ { command: 'parallelcommand1' }, { command: 'parallelcommand2' } ],
          { command: 'serialcommand3' },
          [ { command: 'parallelcommand4' }, { command: 'parallelcommand5' } ]
       ],
*/
       runs: [],
       notify: { type: 'email', 
                 email: 'lloyd.benson@gmail.com'
               },
       created: 'time',
       updated: 'time'
   };

   // generate uuid uniquely?
   var job_id = 1;

   var file = "/tmp/node-ci/job/"+ job_id + "/config.json";
   Fs.writeFileSync(file,JSON.stringify(job,null,3));

   var response = {
       job_id: job_id,
       job: job,
       message: 'created'
   };
   //console.log(response);

   reply(response);
};

exports.deleteJob = function (request,reply) {

   var response = {
       job_id: request.params.job_id,
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
       runs: [],
       created: 'time',
       updated: 'time'
   };
       
   reply(response);
};
