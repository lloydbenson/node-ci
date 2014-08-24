var Fs = require('fs');

// function to recursively make the dir if it does not exist
exports.mkdirp = function (dirpath) {
  
  var parts = dirpath.split('/');
  for ( var i = 2; i <= parts.length; i++ ) {

    var dir = parts.slice(0, i).join('/');
    if ( ! Fs.existsSync(dir) ) {

        	Fs.mkdirSync ( dir );
    }
  }
}