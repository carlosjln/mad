/*!
 * MAD
 * Copyright(c) 2016 Carlos J. Lopez
 * MIT Licensed
 */

'use strict';

var FS = require( 'fs' );
var Path = require( 'path' );

var IO = require( './libs/io' );
var Utils = require( './libs/utilities' );
var Module = require( './libs/module' );

// SHARED VARIABLES
var app_settings = {
	path: null,
	modules_directory: "/modules/"
};
var modules_path = '';
var module_collection = {};

var match_module_url = /^\/mad\/module\//ig;
var match_namespace_joints = /(\.)+/g;

// ALIASES
var get_type = Utils.get_type;

function mad() {

}

mad.setup = function ( settings ) {
	Utils.copy( settings, app_settings );

	update_modules_path();

	detect_modules( modules_path );
};

mad.handle = function ( request, response ) {
	var url = request.url;
	var url_parts = url.replace( match_module_url, "" ).split( "/" );
	var module_name = url_parts[ 0 ];

    var module = module_collection[ module_name ];
    var reply = null;

    if( module ) {
        reply = module.get_model();
    }

    /*
    var method = request.method.toLowerCase();
	if ( method === "get" ) {
	} else if( method === "post" ) {
    }
	*/

	response.end( JSON.stringify( reply ) );
};

mad.modules = function () {
	return module_collection;
};

// HELPERS
function update_modules_path() {
	return modules_path = Path.join( app_settings.path, app_settings.modules_directory );
}

function load_module( mamespace ) {
	var subpath = mamespace.replace( match_namespace_joints, '/' ).replace()
	var filepath = Path.join( app_settings.modules_path, subpath + '.js' );
	var content = "";

	try {
		content = FS.readFileSync( filepath, 'utf-8' );
	} catch( e ) { }

	return content;
}

function detect_modules( path ) {
	var directories = IO.get_directories( path );
	var directory;

	var filepath;
	var content;
	var settings;

	for( var i = directories.length; i--; ) {
		directory = directories[ i ];
		filepath = Path.join( directory, "module.json" );
		content = IO.get_content( filepath );

		// FILE EXIST
		if( content !== null ) {
			try {
				settings = JSON.parse( content );
			} catch( e ) {
				settings = null;
				console.log( 'Warning: Settings file [' + filepath + '] could not be parsed.' );
				console.log( 'Exception: ' + e );
			}
		}

		if( settings !== null ) {
			settings.path = directory;
			settings.modules_path = modules_path;

			var module = new Module( settings );

			var module_id = module.id;
			var module_namespace = module.namespace;

			if( module_collection[ module_id ] === undefined ) {
				module_collection[ module_id ] = module;

				console.log( 'Success: loaded module [' + module_id + ']' );
			} else {
				console.log( 'Warning: module id [' + module_id + '] is already in use.' );
			}

			// DETECT FOR CHILD MODULES
			//detect_modules( directory + '/' + 'modules' );
		}
	}
}

module.exports = mad;