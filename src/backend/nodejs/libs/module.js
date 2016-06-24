var FS = require('fs');
var Path = require('path');

var IO = require('./IO');
var Utils = require('./Utilities');
var copy = Utils.copy;

// RESOURCE MINIFIERS
var MinifyCSS = new (require('clean-css'));

var MinifyHTML = require('html-minifier').minify;
var MinifyHTML_options = {
	removeComments: true,
	removeEmptyAttributes: true,
	
	collapseWhitespace: true,
	minifyCSS: true
};

var MinifyJS = require("uglify-js");
var MinifyJS_options = {
	fromString: true,
	bare_returns: true
};

require('./Prototypes');

module.exports = (function () {
	// ALIASES
	var get_type = Utils.get_type;

	// SHARED VARIABLES
	var module_collection = {};
	
	var match_url_start = /^\/mad\/module\//ig;
	var match_namespace_joints = /(\.)+/g;
	
	var match_js_file = /\.js$/i;
	var match_css_file = /\.css$/i;
	var match_html_file = /\.html$/i;
	
	var match_dot = /\./g;
	var match_backslash = /\//g;
	
	function module( settings ) {
		initialize( this, settings );
	}
	
	module.prototype = {
		execute: function ( action_name, params ) {
			
		},
		
		get_api_data: function function_name(argument) {
			var self = this;
			
			var data = {
				module: {
					id: self.id,
					namespace: self.namespace,
					source: self.source
				},
				
				resources: copy( self.resources, {} )
			};
			
			return data;
		}
	};
	
	function initialize( module, settings ) {
		var modules_path = settings.modules_path;
		
		var path = module.path = settings.path;
		var parent_directories = path.replace( modules_path, '').split('/');
		var directory = parent_directories.splice(-1)[0];
		
		var namespace = ( settings.namespace || parent_directories.join('.') ); // should replace all non alphanumeric characters
		var id = ( settings.id || directory ).replace( match_dot, '_');
		
		if ( namespace ) {
			// TODO: should id be full id path?
			id = namespace + '.' + id;
		} 
		
		// console.log( path );
		// console.log( parent_directories );
		// console.log( 'id> ' + id );
		// console.log( namespace );
		// return;

		// SET MODULE PROPERTIES
		module.id = id;	// TODO: replace non alphanumeric to underscore
		module.namespace = namespace;
		module.source = "";
		
		// KEEP THE ORIGINAL SETTINGS
		module.settings = settings;
		
		// ENSURE DATA STRUCTURE
		var actions = module.actions = get_type( settings.actions ) === 'object' ? settings.actions : {};
		var resources = module.resources = get_type( settings.resources ) === 'object' ? settings.resources : {};
		
		resources.components = get_type( resources.components ) === 'object' ? resources.components : {};
		resources.styles = get_type( resources.styles ) === 'object' ? resources.styles : {};
		resources.templates = get_type( resources.templates ) === 'object' ? resources.templates : {};
		
		// LOAD RESOURCES
		load_source( module );
		
		load_templates( module );
		load_styles( module );
		load_components( module );
		
		load_actions( module );
	}

	function load_source( module ) {
		var module_path = module.path;
		var content = IO.get_content( module_path + '/module.js' ) || "";
		
		// console.log( content );
		// console.log( module_path + '/module.js' );
		// console.log( MinifyJS.minify( module_path + '/module.js' ) );
		
		module.source = MinifyJS.minify( content, MinifyJS_options ).code;
	}
	
	function load_actions( module ) {
		var actions_path = Path.join( module.path, 'actions' );
		var actions = IO.get_files( actions_path, match_js_file );

		var collection = module.actions;
		var content;
		
		var i = actions.length;
		var action_name;
		var file;
		
		while( i-- ) {
			file = actions[i];
			action_name = file.replace('.js','');
			
			content = IO.get_content( actions_path +'/'+ file );
			collection[ action_name ] = new Function( 'return ('+ content +')' )();
		}
	}

	function load_templates( module ) {
		var path = Path.join( module.path, 'resources/templates' );
		var files = IO.get_files( path, match_html_file );
		
		var collection = module.resources.templates;
		var content;
		
		var i = files.length;
		var key;
		var file;
		
		while( i-- ) {
			file = files[i];
			key = file.replace('.html','');
			
			content = IO.get_content( path +'/'+ file ) || "";
			collection[ key ] = MinifyHTML( content, MinifyHTML_options );
		}
	}
	
	function load_styles( module ) {
		var path = Path.join( module.path, 'resources/styles' );
		var files = IO.get_files( path, match_css_file );
		
		var collection = module.resources.styles;
		var content;
		
		var i = files.length;
		var key;
		var file;
		
		while( i-- ) {
			file = files[i];
			key = file.replace('.css','');
			
			content = IO.get_content( path +'/'+ file );
			collection[ key ] = MinifyCSS.minify(content).styles;
		}
	}
	
	function load_components( module ) {
		var path = Path.join( module.path, 'resources/components' );
		var files = IO.get_files( path, match_js_file );
		
		var collection = module.resources.components;
		var content;
		
		var i = files.length;
		var key;
		var file;
		
		while( i-- ) {
			file = files[i];
			key = file.replace('.js','');
			content = IO.get_content( path +'/'+ file ) || "";
			
			collection[ key ] = MinifyJS.minify( content, MinifyJS_options ).code;
		}
	}
	
	return module;	
})();

