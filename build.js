'use strict';

const EOL = require('os').EOL;

const FS = require( 'fs' );
const Path = require( 'path' );
const UglifyJS = require( 'uglify-js' );

let args = process.argv.slice( 2 );
let workspace = args[ 0 ];

let src_directory = Path.join( workspace, 'src' );
let build_directory = Path.join( workspace, 'build' );

// SOURCE FILES
let header = FS.readFileSync( Path.join( src_directory, 'header.txt' ), 'utf-8' );

let mad = Path.join( src_directory, 'mad.js' );
let mad_request = Path.join( src_directory, 'mad.request.js' );
let mad_tools = Path.join( src_directory, 'mad.tools.js' );

let files = [ mad ];

let package_json = JSON.parse( FS.readFileSync( 'package.json', 'utf8' ) );
let version = package_json.version;
let write_flags = { 'flags': 'w+' };

function build( files, output, options ) {
	console.log( 'MINIFYING:' + files.join( ', ' ) );

	try {
		let minified = UglifyJS.minify( files, options );

		FS.writeFileSync( output, minified.code, write_flags );
		console.log( "OUTPUT: " + output );
	} catch( exception ) {
		return console.log( exception );
	}

	console.log( EOL );
}

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
		preamble: header,
		beautify: {
			indent_level: 4,
			bracketize: true,

		}
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
		preamble: header
	}
};

build( files, Path.join( build_directory, 'mad.dev.' + version + '.js' ), dev_options );
console.log( '-' );
build( files, Path.join( build_directory, 'mad.min.' + version + '.js' ), pro_options );