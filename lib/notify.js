// need to keep track of notify status per job_id/run_id

exports.notify = function (notify) {
   
//   console.log(notify);
   if ( notify.type == 'email' ) {
       // eventually email
       // split into an email notification plugin or include by default?
       var response = {
           subject: notify.subject,
           recipients: notify.recipients,
           host: notify.host,
           port: notify.port,
           body: notify.body
       };
       return({"status": "success"});
   }
   else {
   // other ideas for notify plugins
   // campfire, irc, slack, im etc need to loaded per plugin
      return({"status": "failed", "message": "no valid notify type"});
   }
};
