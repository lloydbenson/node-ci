// ideas
// new?
// how do we prototype this effectively to use with other scm?
// should we split out update the job def vs the actual checkout/update?
// force checkout always option

exports.addSCM = function (scm) {

   // for job_id, add scm definition if there is one (add to job or keep it separate config?)
   // none is perfectly acceptable if you are just running code
   // eventually load the specific plugin
   // support multi scm?
   if ( scm.type == 'github' ) {
       
       var response = {
           // if you want automation of prs
           user: user,
           email: email,
           pr: scm.pr,
           // the branch
           branch: scm.branch, 
           // web page to go to // can we figure this out
           web: scm.web,
           //git@ or https
           url: scm.url
           // do we even need?
           refspec: scm.refspec
       };
   }
   // other ideas for notify plugins
   // campfire, irc, slack, im etc need to template per plugin
   reply(response);
};

exports.updateSCM = function (scm) {

   // for job_id, add scm definition if there is one (add to job or keep it separate config?)
   // none is perfectly acceptable if you are just running code
   // eventually load the specific plugin
   // only need to update the bits that changed?
   if ( scm.type == 'github' ) {
       
       var response = {
           user: user,
           email: email,
           // if you want automation of prs
           pr: scm.pr,
           // the branch
           branch: scm.branch, 
           // web page to go to // can we figure this out
           web: scm.web,
           //git@ or https
           url: scm.url
           // do we even need?
           refspec: scm.refspec
       };
   }
   reply(response);
};

exports.deleteSCM = function (scm) {
   // just delete the file and/or entry?
   // needs job_id
   reply(response);
};


exports.prototype.checkout = function (scm) {

   // full checkout
   // job_id or do we want to do a full checkout per run?  (might be interesting to keep track of work spaces per run but wasteful space wise?)
   if ( scm.type == 'github' ) {
       // git clone here 
       // may have to delete if want clean each time - checkbox?
       var response = {
           // if you want automation of prs
           pr: scm.pr,
           // the branch
           branch: scm.branch, 
           // web page to go to // can we figure this out
           web: scm.web,
           //git@ or https
           url: scm.url
           // do we even need?
           refspec: scm.refspec
       };
   }
   // other ideas for notify plugins
   // campfire, irc, slack, im etc need to loaded per plugin
   reply(response);
};

exports.prototype.update = function (scm) {
   
   // update only
   if ( scm.type == 'github' ) {
       // git pull instead
       var response = {
           // if you want automation of prs
           pr: scm.pr,
           // the branch
           branch: scm.branch, 
           // web page to go to // can we figure this out
           web: scm.web,
           //git@ or https
           url: scm.url
           // do we even need?
           refspec: scm.refspec
       };
   }
   // other ideas for notify plugins
   // campfire, irc, slack, im etc need to loaded per plugin
   reply(response);
};
