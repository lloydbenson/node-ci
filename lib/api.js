exports.getJobs = function (request,reply) {
   // provide json list of all jobs with various filters
   reply('got jobs');
};

exports.createJob = function (request,reply) {
   // create new job
   // id, createtime, updatetime, name, command (pre, build, post) (async vs parallel order), scm, before, after, status
   reply('created job');
};

exports.deleteJob = function (request,reply) {
   // delete job via id
   reply('deleted job');
};

exports.updateJob = function (request,reply) {
   // leave create time but can update everything but create time and id
   reply('updated job');
};

exports.getJob = function (request,reply) {
   // based on id get json response
   reply('get job');
};

exports.runJob = function (request,reply) {
   // execute job from id and give back status, elapsed time, run id, need to pass optional timeout
   reply('run job');
};

exports.cancelJob = function (request,reply) {
   // cancel job from id and run id and give back status of cancelled and elapsed time
   reply('cancel job');
};

exports.getJobRun = function (request,reply) {
   // get job status from id and run id and give back status, console and elapsed time
   reply('get job run');
};
