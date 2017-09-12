( function ( mad ) {
	var do_nothing = function () { };
	var XHR = mad.XHR;

	// MODULE RETRIEVAL
	function fetch_module( id, callback, context ) {
		return new XHR( {
			url: 'mad/module/' + id,

			callback: callback || do_nothing,
			callback_context: context,

			before_send: before_send,
			succeeded: fetch_module_succeeded,
			failed: fetch_module_failed,
			completed: fetch_module_completed
		} );
	}

	function before_send() {
		if( DEBUG ) {
			console.log( 'Fetching [' + this.url + ']' );
		}
	}

	function fetch_module_succeeded( reply ) {
		if( !reply ) {
			throw 'WARNING: Empty response from [' + this.url + ']';
		}

		var response;

		try {
			response = new Function( 'return (' + reply + ')' )();
		} catch( e ) {
			throw e;
		}

		var exception = response.exception;

		if( exception ) {
			if( DEBUG ) {
				console.log( 'WARNING: ' + exception )
			}

			return null;
		}

		this.callback.apply( this.callback_context, response );
	}

	function fetch_module_failed( exception ) {
		if( DEBUG ) {
			console.log( 'WARNING: Fetching failed [' + this.url + ']', exception );
		}
	}

	function fetch_module_completed() {
		if( DEBUG ) {
			console.log( 'Fetch completed [' + this.url + ']' );
		}
	}

	// RESOURCES RETRIEVAL
	function fetch_resources( module_id, types, callback, context ) {
		var templates = types.templates || [];
		var styles = types.styles || [];
		var components = types.components || [];

		var data = 'templates=' + types.templates.join( ',' ) + '&' + 'styles=' + styles.join( ',' ) + '&' + 'components=' + components.join( ',' );

		new XHR( {
			url: 'mad/module/' + id + '/resources',

			callback: callback || do_nothing,
			callback_context: context,

			data: data,

			before_send: before_send,
			succeeded: fetch_module_succeeded,
			failed: fetch_module_failed,
			completed: fetch_module_completed
		} );
	}

	mad.api.transport[ 'web' ] = {
		fetch_module: fetch_module,
		fetch_resources: fetch_resources
	};
} )( window.mad );