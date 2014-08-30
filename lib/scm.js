var Git = require('github');

exports.checkout = function (scm) {

   // full checkout
   // job_id or do we want to do a full checkout per run?  (might be interesting to keep track of work spaces per run but wasteful space wise?)
   var response = {};
   if ( scm.type == 'github' ) {
       // git clone here 
       // may have to delete if want clean each time - checkbox?
       response = {
           type: scm.type,
           // if you want automation of prs
           prs: scm.prs,
           // the branch
           branch: scm.branch, 
           //git@ or https
           url: scm.url,
       };
   }
   else {
       response = {
           type: 'none'
       };
   }
   // other ideas for notify plugins
   // campfire, irc, slack, im etc need to loaded per plugin
   return response;
};
