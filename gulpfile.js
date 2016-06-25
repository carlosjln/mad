'use strict';

var gulp = require( 'gulp' );
var fs = require( 'fs-extra' )

gulp.task( 'update-examples', function () {
    var source = './src/backend/nodejs';
    var target = './examples/nodejs/node_modules/mad';

    try {
        fs.emptyDirSync( target );
    } catch ( exception ) {
        console.error( 'Could not empty directory [' + target + ']', exception );
        return;
    }

    try {
        fs.copySync( source, target, { clobber: true } )
    } catch ( err ) {
        console.error( 'Could not copy directory [' + source + ']', exception );
    }
});