exports.addQueue = function (request,reply) {
  // job_id
  // run_id
  // filter for which workers to use
  // maybe track how long on the queue so you can track total run time vs test time, run time, etc
};


exports.createQueue = function (request,reply) {
  // runner_id
  // if a queue doesnt exist yet, create it
};

exports.deleteQueue = function (request,reply) {
  // runner_id
  // if the last runner is being deleted in a queue delete queue
};
