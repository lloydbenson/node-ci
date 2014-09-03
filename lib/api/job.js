var Boom = require('boom');
var Fs = require('fs');
var Hoek = require('hoek');
var Store = require('../store/file');

exports.createJob = function (request, reply) {

   var config = {
       name: request.payload.name,
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
   var result = Store.saveJobConfig(config, null);
   if (result.err) {
       //Boom.badRequest(result.err);
       reply(result);
   }
   else {
       reply(result);
   }
};

exports.deleteJob = function (request,reply) {

   Store.deleteJob(request.params.job_id);
   reply('deleted');
};

exports.updateJob = function (request, reply) {

   var origConfig = Store.getJobConfig(request.params.job_id);
   // i could delete it later, but then id have to reget the config all over again so quicker i think to just delete and redo symlink
   Store.deleteJobLabel(origConfig.name);
   var config = Hoek.applyToDefaults(origConfig, request.payload);
   config.updated = new Date().getTime();
   Store.saveJobConfig(config, request.params.job_id);
   reply(config);
};

exports.getJob = function (request, reply) {

    var config = Store.getJobConfig(request.params.job_id);
    reply(config);
};

exports.getJobs = function (request, reply) {

   var jobs = Store.getJobs();
   reply(jobs);
};
