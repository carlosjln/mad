var fs = require( 'fs' );
var path = require( 'path' );

var http = require( 'http' );
var express = require( 'express' );
var query_string = require( 'querystring' );

var mad = require( "mad" );

var app = express();
var port = process.env.PORT || 8000;

app.use( '/', express.static( __dirname + '/public' ) );

mad.start( {
    modules_path: path.join( __dirname, "public" )
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

//mad.dump_json( __dirname + '\\dump.json', mad.modules() );