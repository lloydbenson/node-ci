var Hapi = require('hapi');
var Hoek = require('hoek');
var Joi = require('joi');
var Api = require('./api');

var internals = {
    defaults: {
        api: {
            basePath: '/api'
        }
    }
};

exports.register = function (plugin, options, next) {


    //is it likely that the base paths will change based on configuration? 
    //I vote we move that out of there.
    var settings = Hoek.applyToDefaults(internals.defaults, options);

    plugin.route([
        { method: 'GET', path: settings.api.basePath+'/jobs', config: { handler: Api.Job.getJobs, description: "get jobs" } },
        { method: 'GET', path: settings.api.basePath+'/job/{job_id}/run', config: { handler: Api.Run.startRun, description: "start run" } },
        { method: 'POST', path: settings.api.basePath+'/job', config: { handler: Api.Job.createJob, description: "create job" } },
        { method: 'GET', path: settings.api.basePath+'/job/{job_id}', config: { handler: Api.Job.getJob, description: "get job" } },
        { method: 'DELETE', path: settings.api.basePath+'/job/{job_id}', config: { handler: Api.Job.deleteJob, description: "delete job" } },
        { method: 'GET', path: settings.api.basePath+'/job/{job_id}/run/{run_id}/console', config: { handler: Api.Run.getConsole, description: "get console" } },
        { method: 'GET', path: settings.api.basePath+'/job/{job_id}/run/{run_id}', config: { handler: Api.Run.getRun, description: "get run" } },
        { method: 'DELETE', path: settings.api.basePath+'/job/{job_id}/run/{run_id}', config: { handler: Api.Run.deleteRun, description: "delete run" } },
        // { method: 'GET', path: settings.api.basePath+'/job/{job_id}/run/{run_id}/cancel', config: { handler: Api.cancelRun, description: "cancel run" } },
        // { method: 'PUT', path: settings.api.basePath+'/job/{job_id}', config: { handler: Api.updateJob, description: "update job" } },
        //Parent/Child tests
        // { method: 'POST', path: settings.api.basePath+'/children', config: { handler: Api.addChild, description: "add child process" } }        
    ]);

    next();
};

exports.register.attributes = {

    pkg: require('../package.json')
};
