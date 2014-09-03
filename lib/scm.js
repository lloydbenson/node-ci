exports.checkout = function (scm) {

   var scm = scm || { type: 'none' };
   // full checkout
   // job_id or do we want to do a full checkout per run?  (might be interesting to keep track of work spaces per run but wasteful space wise?)
   if ( scm.type === 'github' ) {

       var Git = require('github');
       // git clone here 
       // may have to delete if want clean each time - checkbox?
       var response = {
           type: scm.type,
           // if you want automation of prs
           prs: scm.prs,
           // the branch
           branch: scm.branch, 
           //git@ or https
           url: scm.url
        };
        return null;
    }
    else if ( scm.type === 'none' ) {
        //console.log('scm type: ' + scm.type);
        return null;
    }
    else {
        //console.log('invalid scm');
        var err = 'scm type: ' + scm.type + ' is unsupported.';
        return err;
    }
};
