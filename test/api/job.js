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

    it('GET /api/job/{job_id}/run noscm latest', function (done) {
        var job_id = Store.getJobConfigByName('noscm');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run'}, function (response) {

                var latest_id = Store.getRunByLabel(job_id, 'latest');
                var success_id = Store.getRunByLabel(job_id, 'success');
                expect(response.statusCode).to.equal(200);
                expect(response.result.run_id).to.exist;
                expect(response.result.run_id.toString()).to.equal(latest_id);
                expect(response.result.run_id.toString()).to.equal(success_id);

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
        var run_id = Store.getRunByLabel(job_id, 'latest');
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/'+ job_id + '/run/' + run_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

    it('GET /api/job/{job_id}/run/{run_id}/console git', function (done) {
        var job_id = Store.getJobConfigByName('git');
        var run_id = Store.getRunByLabel(job_id, 'latest');
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
        var run_id = Store.getRunByLabel(job_id, 'latest');
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

/*

    it('POST /api/job/{job_id}', function (done) {
        var job_id = Store.getJobConfigByName('git');
        internals.prepareServer(function (server) {
            server.inject({ method: 'POST', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

    it('DELETE /api/job/{job_id}', function (done) {
        var job_id = Store.getJobConfigByName('git');
        internals.prepareServer(function (server) {
            server.inject({ method: 'DELETE', url: '/api/job/'+ job_id }, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });
*/
});
