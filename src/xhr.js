( function ( MAD ) {
	var utilities = MAD.utilities;

	var get_type = utilities.get_type;
	var copy = utilities.copy;
	var serialize = utilities.serialize;

	var do_nothing = function () { };

	var get_transport = window.XMLHttpRequest ?
		function () { return new XMLHttpRequest(); } :
		function () { return new ActiveXObject( 'Microsoft.XMLHTTP' ); };

	function xhr( url, settings ) {
		if( ( this instanceof xhr ) === false ) {
			return new xhr( url, settings );
		}

		if( typeof url === 'object' ) {
			settings = url;
			url = settings.url;
		}

		copy( settings, this );

		var transport = this.transport = get_transport();
		var self = this;

		transport.onreadystatechange = function () {
			on_ready_state_change.call( self );
		};

		this.start();
	}

	xhr.prototype = {
		constructor: xhr,

		url: null,
		method: 'GET',

		before_send: do_nothing,
		succeeded: do_nothing,
		failed: do_nothing,
		completed: do_nothing,

		start: function () {
			var transport = this.transport;
			var context = this.context || this;

			var method = this.method.toUpperCase();

			var data = this.data;
			var url = this.url;

			if( !url ) {
				return;
			}

			if( typeof data === 'object' ) {
				data = serialize( data );
			}

			if( method === 'POST' ) {
				transport.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
			} else if( data ) {
				url = url + ( url.indexOf( '?' ) > -1 ? '&' : '?' ) + data;
				data = null;
			}

			if( this.before_send.call( context ) === false ) {
				return;
			}

			transport.open( method, url, true );
			transport.send( data );

			return this;
		}
	};

	function on_ready_state_change( settings ) {
		var transport = this.transport;
		var ready_state = transport.readyState;
		var status;

		// READY STATE AND STATUS CHECK
		if( ready_state !== 4 ) {
			return null;
		}

		try {
			status = transport.status;
		} catch( e ) { }

		if( status !== 200 ) {
			return null;
		}

		var response_text = transport.responseText;
		var context = this.context || this;
		var exception;

		try {
			this.succeeded.call( context, response_text );
		} catch( e ) {
			exception = e;
			this.failed.call( context, e );
		}

		this.completed.call( thcontextis, response_text, exception );
	}

	MAD.XHR = xhr;

})( MAD );