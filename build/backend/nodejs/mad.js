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

var ResourceProvider = require( './libs/resource_provider' );

// ALIASES
var get_type = Utils.get_type;

// SHARED VARIABLES
var module_collection = {};

var match_module_url = /^\/mad\/module\//ig;

var match_valid_id = /^[a-z0-9-_]+$/i;
var match_valid_namespace = /^[a-z0-9-_.]+$/i;

var match_trailing_slashes = /^(\\|\/)+|(\\|\/)+$/g;
var path_separator = /(?:\\|\/)+/g;

var app_settings = {
	modules_path: null
};

var base_path = '';
var modules_path = '';

function mad() { }

mad.start = function ( settings ) {
	Utils.copy( settings, app_settings );

	base_path = Path.normalize( app_settings.modules_path );
	modules_path = Path.join( base_path, 'modules' );

	var modules_directory_exist = true;

	try {
		var stats = FS.lstatSync( modules_path );
		modules_directory_exist = stats.isDirectory();
	} catch( e ) {
		modules_directory_exist = false;
	}

	if( modules_directory_exist ) {
		detect_modules( modules_path );
	} else {
		console.log( 'Error: modules directory not found [' + modules_path + ']' );
	}
};

mad.handle = function ( request, response ) {
	var url = request.url;
	var url_parts = url.replace( match_module_url, "" ).split( "/" );
	var module_name = url_parts[ 0 ];

    var module = module_collection[ module_name ];
    var reply = null;

    if( module ) {
        reply = module.get_model();

    } else {
		reply = {
			module: {
				id: null,
				namespace: null,
				source: null
			},

			resources: {
				templates: {},
				styles: {},
				components: {}
			},

			exception: "Module not found"
		};
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

mad.dump_json = function ( file, data ) {
	var cache = [];
	var filter = function ( key, value ) {
		if( typeof value === 'object' && value !== null ) {
			if( cache.indexOf( value ) !== -1 ) {
				// Circular reference found, discard key
				return;
			}

			// Store value in our collection
			cache.push( value );
		}

		return value;
	};

	var data = JSON.stringify( data, filter, 4 );

	cache = null;

	FS.writeFile( file, data, function () { });
};

function detect_modules( path, parent_namespace ) {
	if( !path ) {
		return;
	}

	parent_namespace = parent_namespace || "";

	var settings = null;

	var module_json = Path.join( path, "module.json" );
	var settings_json = IO.get_content( module_json );

	var relative_path = path.replace( modules_path, '' ).replace( match_trailing_slashes, '' );
	var relative_parents = relative_path.split( path_separator );

	var current_directory = relative_parents.splice( -1 )[ 0 ];
	var provides_namespace = false;

	// FILE EXIST
	if( settings_json ) {
		provides_namespace = true;

		try {
			settings = JSON.parse( settings_json );
		} catch( e ) {
			settings = null;
			console.log( 'Warning: Settings file could not be parsed [' + module_json + ']' );
			console.log( 'Exception: ' + e );
		}

		if( settings ) {
			var id = settings.id = ( settings.id || current_directory );
			var namespace = settings.namespace;

			if( namespace == undefined ) {
				namespace = settings.namespace = parent_namespace;
			}

			var full_identifier = ( namespace ? namespace + '.' : '' ) + id;

			var id_is_valid = match_valid_id.test( id );
			var namespace_is_valid = namespace ? match_valid_namespace.test( namespace ) : true;

			if( id_is_valid && namespace_is_valid ) {
				var resource_provider = new ResourceProvider( path );
				var module = new Module( settings, resource_provider );

				// ADD/UPDATE MODULE
				module_collection[ full_identifier ] = module;
			} else {
				console.log( 'Exception: module id or namespace is invalid' );
				console.log( 'Module ID: [' + id + ']' );
				console.log( 'Module namespace: [' + namespace + ']' );
			}
		}

		// console.log( 'path', path );
		// console.log( 'parent_namespace', parent_namespace );
		// console.log( '' );

		// console.log( 'modules_path', modules_path );
		// console.log( 'relative_path', relative_path );

		// console.log( 'relative_parents', relative_parents );
		// console.log( 'current_directory', current_directory );
		// console.log( '' );
		// console.log( '' );
	}

	var directories = IO.get_directories( path );
	var d_max = directories.length;
	var directory;

	while( d_max-- ) {
		directory = directories[ d_max ];

		if( directory.toLowerCase() === 'resources' ) {
			continue;
		}

		if( provides_namespace ) {
			parent_namespace = ( parent_namespace ? parent_namespace + '.' : '' ) + current_directory;
		}

		detect_modules( directory, parent_namespace );
	}

}

module.exports = mad;