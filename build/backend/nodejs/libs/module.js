require( './prototypes' );

var FS = require( 'fs' );
var Path = require( 'path' );

var IO = require( './io' );
var Utils = require( './utilities' );
var app_settings = require( './app_settings' );

var ResourceProvider = require( './resource_provider' );

var module_collection = {};

var match_namespace_joints = /(\.)+/g;
var match_dot = /\./g;
var match_path_separator = /(?:\\|\/)+/g;

var match_valid_id = /^[a-z0-9-_]+$/i;

var match_trailing_slashes = /^(\\|\/)+|(\\|\/)+$/g;
var match_path_separator = /(?:\\|\/)+/g;

function Module( settings ) {
	var self = this;
	var path = settings.path;
	var resource_settings = settings.resources;

	self.settings = settings;

	self.id = settings.id;
	self.path = path;

	self.resource_provider = new ResourceProvider( path );
}

Module.prototype = {
	constructor: Module,

	get_model: function function_name() {
		var self = this;
		var resource_provider = self.resource_provider;

		var required = self.settings.required || {};

		var templates = resource_provider.get_templates( required.templates );
		var styles = resource_provider.get_styles( required.styles );
		var components = resource_provider.get_components( required.components );

		var data = {
			module: {
				id: self.id,
				namespace: self.namespace,
				source: resource_provider.get_source() || ""
			},

			resources: {
				templates: templates,
				styles: styles,
				components: components
			}
		};

		return data;
	}
};

// module.create = function ( settings ) {
// 	var resources = settings.resources || {};

// 	var resource_provider = new ResourceProvider( settings.path );
// 	var module = new Module( settings );
// };

Module.load = function ( path ) {
	var settings = load_settings( path );

	if( !settings ) {
		return;
	}

	return new Module( settings );
};

function load_settings( path ) {
	var file = Path.join( path, "module.json" );

	var content = IO.get_content( file );
	var settings = null;
	var exceptions = [];

	if( !content ) {
		return null;
	}

	try {
		settings = JSON.parse( content );
	} catch( e ) {
		exceptions.add( 'Warning: unable to parse settings file.' );
		exceptions.add( e );
		exceptions.add( 'File: ' + file );

		throw exceptions.join( '\n' );
	}

	var module_id = settings.id;

	if( !module_id || !match_valid_id.test( module_id ) ) {
		exceptions.add( 'Warning: invalid module id [' + module_id + ']' );
		exceptions.add( 'File: ' + file );

		throw exceptions.join( '\n' );
	}

	settings.path = path;

	return settings;
}

module.exports = Module;