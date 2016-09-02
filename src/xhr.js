( function ( MAD ) {
	var get_type = MAD.utilities.get_type;
	
	var get_transport = window.XMLHttpRequest ?
		function () { return new XMLHttpRequest(); } :
		function () { return new ActiveXObject( 'Microsoft.XMLHTTP' ); };

	function xhr( settings ) {
		var self = this;

		if( ( self instanceof xhr ) === false ) {
			return new xhr( settings );
		}

		var transport = self.transport = get_transport();

		// COPY ALL PROPERTIES OF SETTING THAT MATCH THE SAME TYPE PROPERTY NAME AND TYPE ON THE REQUEST INSTANCE
		var typeof_default_property;
		var value;

		for( var property in settings ) {
			typeof_default_property = get_type( self[ property ] );
			value = settings[ property ];

			if( settings.hasOwnProperty( property ) && ( typeof_default_property === 'undefined' || typeof_default_property === get_type( value ) ) ) {
				self[ property ] = value;
			}
		}

		var context = self.context || self;
		var method = ( self.method || 'get' ).toUpperCase();
		var url = self.url;
		var data = self.data;

		transport.onreadystatechange = function () {
			on_ready_state_change.call( self );
		};

		transport.open( method, url, true );

		if( method === 'POST' ) {
			transport.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );

		} else if( data ) {
			url = url + ( url.indexOf( '?' ) > -1 ? '&' : '?' ) + data;
			data = null;
		}

		// EXECUTE CALL BACK WITH THE SPECIFIED CONTEXT OR XHR INSTANCE AS CONTEXT
		self.before.call( context, self, settings );

		transport.send( data );
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

	function on_ready_state_change( parameters ) {
		var transport = this.transport;
		var context = this.context || this;

		var ready_state = transport.readyState;

		var status;
		var json;

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

		// PROCESS
		var response_text = transport.responseText;
		var error;

		try {
			json = new Function( 'return (' + response_text + ')' )();
			this.succeeded.call( context, json );

		} catch( e ) {
			error = e;
			this.failed.call( context, e );
		}

		this.completed.call( context, error, json );

		transport.onreadystatechange = undefined;
	}

	function do_nothing() { }

	MAD.XHR = xhr;

})( MAD );