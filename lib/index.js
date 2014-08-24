var Hapi = require('hapi');
var Hoek = require('hoek');
var Joi = require('joi');
var Api = require('./api');

var internals = {
    defaults: {
        api: {
            basePath: '/api'
        },
        mainPath: '/tmp/node-ci',
        jobPath: 'job',
        runPath: 'run',
        workspacePath: 'workspace' 
    }
};

exports.register = function (plugin, options, next) {

    var settings = Hoek.applyToDefaults(internals.defaults, options);

    plugin.route([
        { method: 'GET', path: settings.api.basePath+'/jobs', config: { handler: Api.Job.getJobs, description: "get jobs" } },
        { method: 'GET', path: settings.api.basePath+'/job/{job_id}/run', config: { handler: Api.Run.startRun, description: "start run" } },
        { method: 'POST', path: settings.api.basePath+'/job', config: { handler: Api.Job.createJob, description: "create job" } },
        { method: 'GET', path: settings.api.basePath+'/job/{job_id}/run/{run_id}/console', config: { handler: Api.Run.getConsole, description: "get console" } },
        { method: 'GET', path: settings.api.basePath+'/job/{job_id}/run/{run_id}', config: { handler: Api.Run.getRun, description: "get run" } },
        { method: 'GET', path: settings.api.basePath+'/job/{job_id}', config: { handler: Api.Job.getJob, description: "get job" } },
        // { method: 'GET', path: settings.api.basePath+'/job/{job_id}/run/{run_id}/cancel', config: { handler: Api.cancelRun, description: "cancel run" } },
        // { method: 'PUT', path: settings.api.basePath+'/job/{job_id}', config: { handler: Api.updateJob, description: "update job" } },
        // { method: 'DELETE', path: settings.api.basePath+'/job/{job_id}', config: { handler: Api.deleteJob, description: "delete job" } },
        //Parent/Child tests
        // { method: 'POST', path: settings.api.basePath+'/children', config: { handler: Api.addChild, description: "add child process" } }        
    ]);

    next();
};

exports.register.attributes = {

    pkg: require('../package.json')
};
