node-ci
=======

placeholder for minimal list of ci features

notify,test,scm are prototypes


nodeci-notify-email 
nodeci-scm-github
nodeci-test-npm (if using npm then just do the testing or run based on package.json)
nodeci-trend-local (use local store)
nodeci-trend-splunk (integrate with splunk)
nodeci-archive (lets have a couple simple policies but they can be overwritten?)
nodeci-core (maybe a plugin but have a nodeci-server example that shows multiple plugin setup?)

// job chaining
job chaining based on resulting status
job dependencies before?

// archive
archival / archival policy (# of runs or based on time)

// testing - this is optional, can just run something independently without a test.  this just makes a specific block of the build easy config wise for standard stuff
testing - how do we want to structure tests
top level (job name?)
  -> experiments (collection of tests)
     -> tests

-need to handle durations per level
-types - disabled, fail, pass
-if fail need to handle error
-handle id number
-test results are per job_id, run_id

//trending (how do we want to store data results)
aggregate results, might be nice to have a simple local store, but maybe even cooler integration with splunk, logstash, etc if you dont want to use native but still want stuff in one location
after you figure out aggregate, can we just store vs having to redo it again, can we easily add to the resulting data set
dont want to remove the others (reset flag to clear data if thats what you really do want?)

// native ssh support for deploys?
// how do we extend building blocks for use (before, after)

// how do we want to handle initial auth -- local might be annoying unless theres a great easy module to do this already should be lightweight json friendly etc // utilize bell here?

// have register slave function (esp important for windows) so the master doesn't have to talk to the slave to be useful
// need master/slave grouping (os partitioning, speciality function)
// child count auto but overridable (1 per cpu?)

// use queue (add, filter for slave) // this would be the abtract to add to slaves



