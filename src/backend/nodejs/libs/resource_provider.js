var FS = require( 'fs' );
var Path = require( 'path' );

var IO = require( './io' );
var Utils = require( './utilities' );

var match_js_file = /\.js$/i;
var match_css_file = /\.css$/i;
var match_html_file = /\.html$/i;

var match_file_extension = /\.[^/.]+$/;

function resource_provider( module_path ) {
	var self = this;

	self.module_path = module_path;
	self.resources_path = Path.join( module_path, "resources" );
}

resource_provider.prototype = {
	constructor: resource_provider,

	get_source: function () {
		return IO.get_content( Path.join( this.module_path, 'module.js' ) );
	},

	get_templates: function () {
		return this.get_resources( "templates", match_html_file );
	},

	get_styles: function () {
		return this.get_resources( "styles", match_css_file );
	},

	get_components: function () {
		return this.get_resources( "components", match_js_file );
	},

	get_resources: function ( resource, file_filter ) {
		var path = Path.join( this.resources_path, resource );
		var files = IO.get_files( path, file_filter );

		var collection = {};

		var i = files.length;
		var key;
		var filename;

		while( i-- ) {
			filename = files[ i ];
			key = filename.replace( match_file_extension, '' );
			collection[ key ] = IO.get_content( Path.join( path, filename) ) || "";
		}

		return collection;
	}
};

module.exports = resource_provider;