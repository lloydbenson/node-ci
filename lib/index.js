var Hapi = require('hapi');
var Hoek = require('hoek');
var Joi = require('joi');

var Api = require('./api');

var internals = {
    defaults: 'api'
};

exports.register = function (plugin, options, next) {

    var settings = Hoek.applyToDefaults(internals.defaults, options);
        
    plugin.route([
        { method: 'GET', path: settings.basePath+'/jobs', config: { handler: Api.getJobs, description: "get jobs" } },
        { method: 'GET', path: settings.basePath+'/job/{id}', config: { handler: Api.getJob, description: "get job" } },
        { method: 'GET', path: settings.basePath+'/job/{id}/run', config: { handler: Api.runJob, description: "run job" } },
        { method: 'GET', path: settings.basePath+'/job/{id}/run/{run_id}', config: { handler: Api.getJobRun, description: "get job run" } },
        { method: 'GET', path: settings.basePath+'/job/{id}/run/{run_id}/cancel', config: { handler: Api.cancelJob, description: "cancel run" } },
        { method: 'POST', path: settings.basePath+'/job', config: { handler: Api.createJob, description: "create job" } },
        { method: 'POST', path: settings.basePath+'/job/{id}', config: { handler: Api.updateJob, description: "update job" } },
        { method: 'DELETE', path: settings.basePath+'/job/{id}', config: { handler: Api.deleteJob, description: "delete job" } }
    ]);

    next();
};

exports.register.attributes = {

    pkg: require('../package.json')
};

