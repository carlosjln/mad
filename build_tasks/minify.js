'use strict';

const EOL = require( 'os' ).EOL;

const FS = require( 'fs' );
const Path = require( 'path' );
const UglifyJS = require( 'uglify-js' );

let args = process.argv.slice( 2 );
let workspace_directory = args[ 0 ];

let src_directory = Path.join( workspace_directory, 'src' );
let target_directory = Path.join( workspace_directory, 'dist' );

// SOURCE FILES
let mad = Path.join( src_directory, 'mad.js' );
let polyfils = Path.join( src_directory, 'polyfils.js' );
let utilities = Path.join( src_directory, 'utilities.js' );
let html = Path.join( src_directory, 'html.js' );
let xhr = Path.join( src_directory, 'xhr.js' );
let resource_collection = Path.join( src_directory, 'resource_collection.js' );
let mod = Path.join( src_directory, 'module.js' );
let api = Path.join( src_directory, 'api.js' );
let web_transport = Path.join( src_directory, 'web_transport.js' );

let target_files = [ mad, polyfils, utilities, html, xhr, resource_collection, mod, api, web_transport ];

let package_json = JSON.parse( FS.readFileSync( 'package.json', 'utf8' ) );
let version = package_json.version;
let write_flags = { 'flags': 'w+' };

let dev_options = {
	//warnings: true,

	compress: {
		dead_code: true,
		drop_debugger: false,
		unused: true,

		global_defs: {
			DEBUG: true
		}
	},

	output: {
		beautify: {
			indent_level: 4,
			bracketize: true
		},

		comments: /license MIT/
	}
};

let pro_options = {
	compress: {
		dead_code: true,
		drop_debugger: true,
		unused: true,

		global_defs: {
			DEBUG: false
		}
	},

	output: {
		comments: /license MIT/
	}
};

function build( files, target_file, options ) {
	try {
		let output = UglifyJS.minify( files, options );
		FS.writeFileSync( target_file, output.code, write_flags );
		console.log( '[' + files.length + ']' + " Files minified into: " + target_file );
	} catch( exception ) {
		return console.log( exception );
	}
}

build( target_files, Path.join( target_directory, 'mad.' + version + '.js' ), dev_options );
console.log( '-' );
build( target_files, Path.join( target_directory, 'mad.min.' + version + '.js' ), pro_options );
