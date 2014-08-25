var Hapi = require('hapi');
var Lab = require('lab');
var Notify = require('../lib/notify');

var internals = {};

var lab = exports.lab = Lab.script();
var expect = Lab.expect;
var before = lab.before;
var after = lab.after;
var describe = lab.describe;
var it = lab.it;

describe('notify', function () {

    it('email', function (done) {

        var notify = {
            type: 'email',
            job_id: 1,
            run_id: 1,
            subject: 'test',
            recipients: [ 'lloydbenson@gmail.com', 'backer@gmail.com' ],
            body: 'this is a body of text',
            host: 'localhost',
            port: 25
        };
        var expectedResult = '{"status":"success"}';
        var status = JSON.stringify(Notify.notify(notify));
        expect(status).to.equal(expectedResult);
        done();
    });

    it('invalid', function (done) {

        var notify = {
            type: 'invalid'
        };
        var expectedResult = '{"status":"failed","message":"no valid notify type"}';
        var status = JSON.stringify(Notify.notify(notify));
        expect(status).to.equal(expectedResult);
        done();
    });
});
