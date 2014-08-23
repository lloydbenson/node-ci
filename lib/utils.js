var Fs = require('fs');

// function to recursively make the dir if it does not exist
exports.mkdirp = function (dirpath) {

  var parts = dirpath.split('/');
  for ( var i = 2; i <= parts.length; i++ ) {

    Fs.exists(dirpath, function(exists) {
        if (!exists) {

            Fs.mkdirSync( parts.slice(0, i).join('/') );
        }
    });
  }
}