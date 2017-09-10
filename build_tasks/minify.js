'use strict';

const EOL = require( 'os' ).EOL;

const FS = require( 'fs' );
const Path = require( 'path' );
const UglifyJS = require( 'uglify-js' );

// USE THE SPECIFIED DIRECTORY OR THE CURRENT RUNNING DIRECTORY
let args = process.argv.slice( 2 );
let workspace_directory = args[ 0 ] || Path.resolve( __dirname, '..' );

let src_directory = Path.join( workspace_directory, 'src' );

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

let src_files = [ mad, polyfils, utilities, html, xhr, resource_collection, mod, api, web_transport ];

let package_json = JSON.parse( FS.readFileSync( 'package.json', 'utf8' ) );
let version = package_json.version;

let target_directory = Path.join( workspace_directory, 'dist', version );
let dev_file = Path.join( target_directory, 'mad.js' );
let prod_file = Path.join( target_directory, 'mad.min.js' );

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

let prod_options = {
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

function ensure_directory( dirname ) {
	if( FS.existsSync( dirname ) ) {
		return;
	}

	ensure_directory( Path.dirname( dirname ) );

	FS.mkdirSync( dirname );
}

function build( files, filepath, options ) {
	try {
		let output = UglifyJS.minify( files, options );

		ensure_directory( Path.dirname( filepath ) );
		FS.writeFileSync( filepath, output.code, write_flags );

		console.log( '[' + files.length + ']' + " Files minified into: " + filepath );

	} catch( exception ) {
		return console.log( exception );
	}
}

build( src_files, dev_file, dev_options );
console.log( '-' );
build( src_files, prod_file, prod_options );