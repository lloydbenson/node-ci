var Lab = require('lab');
var Hapi = require('hapi');
var Store = require('../../lib/store/file');

var internals = {};

var lab = exports.lab = Lab.script();
var expect = Lab.expect;
var before = lab.before;
var after = lab.after;
var describe = lab.describe;
var it = lab.it;

internals.prepareServer = function (callback) {
    var server = new Hapi.Server();

    server.pack.register({

        plugin: require('../..')
    }, function (err) {

        expect(err).to.not.exist;
        callback(server);
    });
};

describe('api', function () {    
/*

    it('GET /api/job/{job_id}/run/{run_id}/cancel', function (done) {
        var job_id = Store.getJobConfigByName('git');
        var run_id = 1;
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id + '/cancel' }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });
*/
  it('POST /api/job parallelcommand', function (done) {
        internals.prepareServer(function (server) {

            var payload = {
                name: "parallelcommand",
                command: [ "sleep 5", "sleep 2" ]
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                expect(response.result.job_id).to.exist;
                done();
            });
        });
   });

   it('GET /api/job/{job_id}/run parallelcommand', function (done) {
        var job_id = Store.getJobConfigByName('parallelcommand');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run'}, function (response) {

                var lastSuccess_id = Store.getRunByLabel(job_id, 'lastSuccess');
                expect(response.statusCode).to.equal(200);
                expect(response.result.run_id).to.exist;
                expect(lastSuccess_id).to.not.exist;
                done();
            });
        });
    });

    it('DELETE /api/job/{job_id} parallelcommand', function (done) {
        var job_id = Store.getJobConfigByName('parallelcommand');
        internals.prepareServer(function (server) {
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

   it('POST /api/job missingcommand', function (done) {
        internals.prepareServer(function (server) {

            var payload = {
                name: "missingcommand"
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                expect(response.result.job_id).to.not.exist;
                expect(response.result.err).to.exist;
                done();
            });
        });
   });

   it('POST /api/job missingcommand', function (done) {
        internals.prepareServer(function (server) {

            var payload = {
                name: "missingcommand",
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                expect(response.result.job_id).to.not.exist;
                expect(response.result.err).to.exist;
                done();
            });
        });
   });

/*
   it('POST /api/job sleep5', function (done) {
        internals.prepareServer(function (server) {

            var payload = {
                name: "sleep5",
                command: "sleep 5"
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                expect(response.result.job_id).to.exist;
                done();
            });
        });
    });

// want to try to abort this
// maybe background a process that runs every 1s and tries to kill the specific command by the same user?
// generate bash script with sleep with specific name
    it('GET /api/job/{job_id}/run sleep5', function (done) {
        var job_id = Store.getJobConfigByName('sleep5');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run'}, function (response) {

                var lastSuccess_id = Store.getRunByLabel(job_id, 'lastSuccess');
                expect(response.statusCode).to.equal(200);
                expect(response.result.run_id).to.exist;
                expect(lastSuccess_id).to.exist;
                done();
            });
        });
    });

    it('DELETE /api/job/{job_id} sleep5', function (done) {
        var job_id = Store.getJobConfigByName('sleep5');
        internals.prepareServer(function (server) {
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });
*/

    it('POST /api/job badcmd', function (done) {
        internals.prepareServer(function (server) {

            var payload = {
                name: "badcmd",
                command: "uptime"
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                expect(response.result.job_id).to.exist;
                done();
            });
        });
    });

    it('PUT /api/job/{job_id} badcommand', function (done) {
        var job_id = Store.getJobConfigByName('badcmd');
        var payload = { name: "badcommand", command: "uptim" };
        internals.prepareServer(function (server) {
            server.inject({ method: 'PUT', url: '/api/job/'+ job_id, payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.updated).to.exist;
                expect(response.result.name).to.equal('badcommand');
                expect(response.result.command).to.equal('uptim');
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/run badcommand', function (done) {
        var job_id = Store.getJobConfigByName('badcommand');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run'}, function (response) {

                var lastSuccess_id = Store.getRunByLabel(job_id, 'lastSuccess');
                var lastFail_id = Store.getRunByLabel(job_id, 'lastFail');
                expect(response.statusCode).to.equal(200);
                expect(response.result.run_id).to.exist;
                expect(lastFail_id).to.exist;
                expect(lastSuccess_id).to.not.exist;
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/run/{run_id} badcommand', function (done) {
        var job_id = Store.getJobConfigByName('badcommand');
        var run_id = Store.getRunByLabel(job_id, 'lastFail');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.status).is.equal('failed');
                expect(response.result.finishTime).is.greaterThan(run_id);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

    it('DELETE /api/job/{job_id} badcommand', function (done) {
        var job_id = Store.getJobConfigByName('badcommand');
        internals.prepareServer(function (server) {
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

    it('POST /api/job invalidscm', function (done) {
        internals.prepareServer(function (server) {

            var payload = {
                name: "invalidscm",
                scm: {
                    type: 'invalid'
                },
                pre: "date",
                command: "uptime",
                post: "cat /etc/hosts"
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                expect(response.result.job_id).to.exist;
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/run invalidscm', function (done) {
        var job_id = Store.getJobConfigByName('invalidscm');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run'}, function (response) {

                var lastFail_id = Store.getRunByLabel(job_id, 'lastFail');
                var lastSuccess_id = Store.getRunByLabel(job_id, 'lastSuccess');
                expect(response.statusCode).to.equal(200);
                expect(response.result.run_id).to.exist;
                expect(lastSuccess_id).to.not.exist;
                expect(lastFail_id).to.exist;
                done();
            });
        });
    });

    it('DELETE /api/job/{job_id} invalidscm', function (done) {
        var job_id = Store.getJobConfigByName('invalidscm');
        internals.prepareServer(function (server) {
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

    it('POST /api/job noscm', function (done) {
        internals.prepareServer(function (server) {

            var payload = {
                name: "noscm",
                pre: "date",
                command: "uptime",
                post: "cat /etc/hosts"
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                expect(response.result.job_id).to.exist;
                done();
            });
        });
    });

    it('POST /api/job git', function (done) {
        internals.prepareServer(function (server) {

            var payload = {
                name: "git",
                scm: {
                    type: 'github',
                    url: 'git@github.com:lloydbenson/node-ci',
                    prs: true,
                    branch: 'origin/master'
                },
                pre: "date",
                command: "uptime",
                post: "cat /etc/hosts"
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                expect(response.result.job_id).to.exist;
                done();
            });
        });
    });

    it('GET /api/jobs', function (done) {
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/jobs'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(2);
                done();
            });
        });
    });

    it('GET /api/job/{job_id} git', function (done) {
        var job_id = Store.getJobConfigByName('git');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/run git', function (done) {
        var job_id = Store.getJobConfigByName('git');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.run_id).to.exist;
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/run noscm', function (done) {
        var job_id = Store.getJobConfigByName('noscm');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.run_id).to.exist;
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/run noscm labels', function (done) {
        var job_id = Store.getJobConfigByName('noscm');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run'}, function (response) {

                var last_id = Store.getRunByLabel(job_id, 'last');
                var lastSuccess_id = Store.getRunByLabel(job_id, 'lastSuccess');
                expect(response.statusCode).to.equal(200);
                expect(response.result.run_id).to.exist;
                expect(response.result.run_id.toString()).to.equal(last_id);
                expect(response.result.run_id.toString()).to.equal(lastSuccess_id);
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/runs', function (done) {

        var job_id = Store.getJobConfigByName('noscm');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/' + job_id + '/runs'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.have.length(2);
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/run/{run_id} git', function (done) {
        var job_id = Store.getJobConfigByName('git');
        var run_id = Store.getRunByLabel(job_id, 'last');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.status).is.equal('succeeded');
                expect(response.result.finishTime).is.greaterThan(run_id);
                expect(response.result.elapsedTime).is.greaterThan(0);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/run/{run_id}/console git', function (done) {
        var job_id = Store.getJobConfigByName('git');
        var run_id = Store.getRunByLabel(job_id, 'last');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id + '/console' }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.result.console).to.exist;
                done();
            });
        });
    });

    it('DELETE /api/job/{job_id}/run/{run_id} git', function (done) {
        var job_id = Store.getJobConfigByName('git');
        var run_id = Store.getRunByLabel(job_id, 'last');
        internals.prepareServer(function (server) {
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id + '/run/' + run_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

    it('DELETE /api/job/{job_id} git', function (done) {
        var job_id = Store.getJobConfigByName('git');
        internals.prepareServer(function (server) {
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

    it('DELETE /api/job/{job_id} noscm', function (done) {
        var job_id = Store.getJobConfigByName('noscm');
        internals.prepareServer(function (server) {
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

});
