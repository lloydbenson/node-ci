
var internals = {
	jobs: []
};

exports.add = function (job, callback) {

	internals.jobs.push(job);
	callback(null, internals.jobs);
}

experts.find = function (id, callback) {

	var job = internals.find(id);

	if(job){
		callback(null, job);
	}

	else {

		callback(new Error('unable to find by by ID ' + id), null);
	}
}

exports.delete = function (id, callback) {

	var job = internals.find(id);

	if(job){
		callback(null, internals.jobs)
	}

	else {
		callback(new Error('unable to find job by ID ' + id), null);
	}
}

internals.find = function (id) {

	for(var i=0, jl=internals.jobs.length; i<jl; ++i){

		var job = internals.jobs[i];
		if(job.id && job.id){
			return { index: i, job: job };
		}
	}

	return null;
}