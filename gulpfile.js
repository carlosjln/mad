'use strict';

var gulp = require( 'gulp' );
var fs = require( 'fs-extra' )

gulp.task( 'update-examples', function () {
    var source = '.\\src\\backend\\nodejs';
    var target = '.\\examples\\nodejs\\node_modules\\mad';

    // BACKEND FILES
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

    // FRONTEND FILES
    try {
        fs.copySync( '.\\src\\javascript', '.\\examples\\nodejs\\public\\resources\\scripts\\libraries\\mad-js', { clobber: true } )
    } catch ( err ) {
        console.error( 'Could not copy front-end directory', exception );
    }
});

gulp.task( 'build-nodejs', function () {
    var source = '.\\src\\backend\\nodejs';
    var target = '.\\build\\backend\\nodejs';

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