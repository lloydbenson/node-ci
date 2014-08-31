var Fs = require('fs');
var Store = require('../store/file');

exports.createJob = function (request, reply) {

   var job = {
       name: request.payload.name,
       /*
       scm: {
          type: 'github',
          url: 'git@github.com:lloydbenson/node-ci',
          // if you have this it will automatically do a run for every pr
          // need to include it in git because pr is a more specific concept
          prs: true,
          branch: 'origin/master'
       },
       */
       scm: request.payload.scm,
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
       created: new Date().getTime()
   };
   var job_id = Store.saveJobConfig(job);
   reply({ job_id: job_id });
};

exports.deleteJob = function (request,reply) {

   Store.deleteJob(request.params.job_id);
   reply('deleted');
};

exports.updateJob = function (request, reply) {
   var response = {
       job_id: request.params.job_id,
       statusCode: 200,
       message: 'updated'
   };
   reply(response);
};

exports.getJob = function (request, reply) {

    var response = Store.getJobConfig(request.params.job_id);
    reply(response);
};

exports.getJobs = function (request, reply) {

   var jobs = Store.getJobs();
   reply(jobs);
};
