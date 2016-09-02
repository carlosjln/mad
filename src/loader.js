( function ( MAD, window ) {

	var Module = MAD.Module;
	var XHR = MAD.XHR;

	var utils = MAD.utilities;
	var get_type = utils.get_type;

	var cached_modules = {};
	// var shared_module = Module.initialize( { id: 'shared', source: 'function shared() {return false;}' });

	var request = ( typeof window !== 'undefined' && window.process && window.process.type === "renderer" ) ? local_request : xhr_request;

	function get_module( id, callback, params ) {
		var typeof_callback = get_type( callback );

		if( typeof_callback !== 'function' ) {
			params = callback;
			callback = do_nothing;
		}

		params = params === void 0 ? [] : params;
		params = get_type( params ) === 'array' ? params : [ params ];

		var module = cached_modules[ id ];

		if( module ) {
			module.initialize.apply( module, params );
			callback.apply( module, params );
			return module;
		}

		var context = {
			module_id: id,
			callback: callback,
			params: params
		};

		return new XHR( {
			url: 'mad/module/' + id,

			context: context,

			before: before,
			succeeded: succeeded,
			failed: failed,
			completed: completed
		});
	}

	function xhr_request() {

	}

	function local_request() {

	}

	function before() {
		if( DEBUG ) {
			console.log( 'Requesting module: ', this.module_id );
		}
	}

	function succeeded( reply ) {
		if( !reply ) {
			return console.log( 'Exception: Module could not be loaded.' );
		}

		if( reply.exception ) {
			return console.log( 'Exception: ' + ( reply.exception || 'Module could not be loaded.' ) );
		}

		var context = this;

		var id = context.module_id;
		var params = context.params;

		var module = Module.initialize( reply, params );

		if( module ) {
			cached_modules[ id ] = module;
			context.callback.apply( module, params );
		}
	}

	function failed( exception ) {
		throw exception;
	}

	function completed() {
		if( DEBUG ) {
			console.log( 'Completed requesting module: ', this.module_id );
		}
	}

	function do_nothing() { }

	MAD.get_module = get_module;

})( MAD, window, document );