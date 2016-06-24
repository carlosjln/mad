'use strict';

/*!
 * MAD
 * Copyright(c) 2016 Carlos J. Lopez
 * MIT Licensed
 */
 
var FS = require('fs');
var Path = require('path');

var IO = require('./IO');
var Utils = require('./Utilities');
var Module = require('./Module');

module.exports = (function(){
	// ALIASES
	var get_type = Utils.get_type;
	
	// SHARED VARIABLES
	var module_collection = {};
	
	var match_module_url = /^\/mad\/module\//ig;
	var match_namespace_joints = /(\.)+/g;
	var match_js_file = /\.js$/i;
	var match_dot = /\./g;
	var match_backslash = /\//g;
	
	var app_settings = {
	    path: null,
	    modules_directory: "/modules/"
	};
	
	var modules_path = '';
	
	function mad(){
		
	}
	
	function modules() {
		return module_collection;
	}
	
	function load_module( mamespace ) {
		var subpath = mamespace.replace( match_namespace_joints, '/' ).replace()
	    var filepath = Path.join( app_settings.modules_path , subpath +'.js');
	    var content = "";
	    
	    try {
	        content = FS.readFileSync(filepath, 'utf-8');
	    } catch( e ) {}
	    
	    return content;
	}
	
	function update_modules_path() {
		return modules_path = Path.join( app_settings.path, app_settings.modules_directory );
	}
	
	function detect_modules( path ) {
		var directories = IO.get_directories( path );
		var directory;
		
		var filepath;
		var content;
		var settings;
		
		for (var i = directories.length; i--; ) {
			directory = directories[i];
			filepath = Path.join( directory, "module.json" );
			content = IO.get_content( filepath );
			
			// FILE EXIST
			if( content !== null ) {
				try {
					settings = JSON.parse( content );
				} catch (e) {
					settings = null;
					console.log( 'Warning: Settings file ['+ filepath +'] could not be parsed.' );
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
					
					console.log( 'Success: loaded module ['+ module_id +']' );
				} else {
					console.log( 'Warning: module id ['+ module_id +'] is already in use.' );
				}

				// DETECT FOR CHILD MODULES
				//detect_modules( directory + '/' + 'modules' );
			}
		}
	}
	
	mad.setup = function( settings ) {
		Utils.copy( settings, app_settings );
		
		update_modules_path();
		
		detect_modules( modules_path );
	};
	
	mad.handle = function( request, response ){
		var url = request.url;
		var url_parts = url.replace(match_module_url,"").split("/");
		var module_name = url_parts[0];
		
		var method = request.method.toLowerCase();
		
		var reply = null;
		console.log( url );
		console.log( method );
		console.log( module_name );
		
		if ( method === "get" ) {
			var module = module_collection[ module_name ];
			
			if( module ) {
				reply = module.get_api_data();
			}
			
		} else if( method === "post" ) {
			
		}
		
		response.end( JSON.stringify(reply) );
		
		// var cache = [];
		// var data = JSON.stringify( request, function(key, value) {
		//     if (typeof value === 'object' && value !== null) {
		//         if (cache.indexOf(value) !== -1) {
		//             // Circular reference found, discard key
		//             return;
		//         }
		//         // Store value in our collection
		//         cache.push(value);
		//     }
		//     return value;
		// });
		
		// cache = null;
		
		// response.end( data );
	};
	
	mad.modules = modules;
	
	return mad;
})();