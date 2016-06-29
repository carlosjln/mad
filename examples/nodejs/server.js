var fs = require( 'fs' );
var path = require( 'path' );

var http = require( 'http' );
var express = require( 'express' );
var query_string = require( 'querystring' );

var mad = require( "mad" );

var app = express();
var port = process.env.PORT || 8000;

app.use( '/', express.static( __dirname + '/public' ) );

mad.setup( {
    path: __dirname,
    modules_directory: "/public/modules/"
});

app.get( '/mad/*', function ( request, response ) {
    mad.handle( request, response );
});

app.post( '/mad/*', function ( request, response ) {
    mad.handle( request, response );
});

app.listen( port, function () {
    console.log( 'MAD app is running wild on port: ' + port );
});

dump_json( __dirname + '\\dump.json', mad.modules() );

function dump_json( file, data ) {
	var cache = [];
	var data = JSON.stringify( data, function ( key, value ) {
		if( typeof value === 'object' && value !== null ) {
			if( cache.indexOf( value ) !== -1 ) {
				// Circular reference found, discard key
				return;
			}
			// Store value in our collection
			cache.push( value );
		}
		return value;
	}, 4 );

	cache = null;

	fs.writeFile( file, data, function () { });
}