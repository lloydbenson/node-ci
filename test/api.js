var Lab = require('lab');
var Hapi = require('hapi');

var internals = {};

var expect = Lab.expect;
var before = Lab.before;
var after = Lab.after;
var describe = Lab.experiment;
var it = Lab.test;

internals.prepareServer = function (callback) {
    var server = new Hapi.Server();

    server.pack.register({

        plugin: require('../')
    }, function (err) {

        expect(err).to.not.exist;
        callback(server);
    });
};
    
describe('api', function () {

    it('GET /api/jobs', function (done) {
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/jobs'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

    it('GET /api/job/id', function (done) {
        internals.prepareServer(function (server) {
            server.inject({ method: 'GET', url: '/api/job/id'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

    it('POST /api/job', function (done) {
        internals.prepareServer(function (server) {
            server.inject({ method: 'POST', url: '/api/job'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

    it('POST /api/job/id', function (done) {
        internals.prepareServer(function (server) {
            server.inject({ method: 'POST', url: '/api/job/id'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });

    it('DELETE /api/job/id', function (done) {
        internals.prepareServer(function (server) {
            server.inject({ method: 'DELETE', url: '/api/job/id'}, function (response) {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist;
                done();
            });
        });
    });
});
