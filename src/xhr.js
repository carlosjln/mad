( function ( MAD ) {
	var utilities = MAD.utilities;

	var get_type = utilities.get_type;
	var copy = utilities.copy;
	var serialize = utilities.serialize;

	var get_transport = window.XMLHttpRequest ?
		function () { return new XMLHttpRequest(); } :
		function () { return new ActiveXObject( 'Microsoft.XMLHTTP' ); };

	function xhr( settings ) {
		if( ( this instanceof xhr ) === false ) {
			return new xhr( settings );
		}

		var options = this.options = copy( settings, {});
		var transport = this.transport = get_transport();

		// COPY ALL PROPERTIES OF SETTING THAT MATCH THE SAME TYPE PROPERTY NAME AND TYPE ON THE REQUEST INSTANCE
		// var typeof_default_property;
		// var value;

		// for( var property in settings ) {
		// 	typeof_default_property = get_type( this[ property ] );
		// 	value = settings[ property ];

		// 	if( settings.hasOwnProperty( property ) && ( typeof_default_property === 'undefined' || typeof_default_property === get_type( value ) ) ) {
		// 		this[ property ] = value;
		// 	}
		// }

		var method = ( options.method || 'get' ).toUpperCase();
		var query = options.query;
		var url = options.url;

		var self = this;

		transport.onreadystatechange = function () {
			on_ready_state_change.call( self, options );
		};

		if( typeof query === 'object' ) {
			query = serialize( query );
		}

		if( method === 'POST' ) {
			transport.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
		} else if( query ) {
			url = url + ( url.indexOf( '?' ) > -1 ? '&' : '?' ) + query;
			query = null;
		}

		transport.open( method, url, true );

		// EXECUTE CALL BACK WITH THE SPECIFIED CONTEXT OR XHR INSTANCE AS CONTEXT
		( options.before || this.before ).call( this, options );

		transport.send( query );
	}

	xhr.prototype = {
		constructor: xhr,

		url: '',
		method: 'GET',

		before: do_nothing,
		succeeded: do_nothing,
		failed: do_nothing,
		completed: do_nothing
	};

	function on_ready_state_change( options ) {
		transport.onreadystatechange = undefined;

		var transport = this.transport;
		var ready_state = transport.readyState;
		var status;

		// READY STATE AND STATUS CHECK
		if( ready_state !== 4 ) {
			return null;
		}

		try {
			status = transport.status;
		} catch( e ) {
			return null;
		}

		if( status !== 200 ) {
			return null;
		}

		var succeeded = options.succeeded || this.succeeded;
		var completed = options.completed || this.completed;

		var response_text = transport.responseText;
		var exception;

		try {
			succeeded.call( this, response_text );
		} catch( e ) {
			exception = e;
			failed.call( context, e );
		}

		completed.call( context, response_text, exception );
	}

	function do_nothing() { }

	MAD.XHR = xhr;

})( MAD );