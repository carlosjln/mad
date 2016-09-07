( function ( MAD, window ) {

	var Module = MAD.Module;
	var XHR = MAD.XHR;

	var utilities = MAD.utilities;
	var get_type = utilities.get_type;
	var UID = utilities.UID;

	var modules_collection = {};
	var current_platform = get_platform();

	var request_context = ( function () {
		var items = [];

		function add() {
			var id = UID();
			var data = {}
		}

		function remove() {

		}

		function find() {

		}

		return {
			add: add,
			remove: remove,
			find: find
		};
	})();

	var do_nothing = function () { };

	var web_transport = ( function () {
		function request( id, callback ) {
			new XHR( {
				url: 'mad/module/' + id,

				module_id: id,
				callback: callback || do_nothing,

				before: before,
				succeeded: succeeded,
				failed: failed,
				completed: completed
			});
		}

		function before() {
			if( DEBUG ) {
				console.log( 'fetching module: ', this.module_id );
			}
		}

		function succeeded( reply ) {
			if( !reply ) {
				return console.log( 'WARNING: Module not loaded.' );
			}

			var response;
			var exception;

			try {
				response = new Function( 'return (' + reply + ')' )();
			} catch( e ) {
				exception = e;
			}

			exception = exception || response.exception;

			if( exception ) {
				return console.log( 'WARNING: ' + exception );
			}

			this.callback.apply( this, response );
		}

		function failed( exception ) {
			throw exception;
		}

		function completed() {
			if( DEBUG ) {
				console.log( 'fetched module: ', this.module_id );
			}
		}

		return request;
	})();

	var transport = {
		'web': web_transport
	};

	var api = {
		transport: transport,
		fetch_module: fetch_module,
		fetch_resources: fetch_resources
	};

	function get_module( id, callback, params ) {
		var typeof_callback = get_type( callback );

		if( typeof_callback !== 'function' ) {
			params = callback;
			callback = do_nothing;
		}

		params = params === void 0 ? [] : params;
		params = get_type( params ) === 'array' ? params : [ params ];

		// IMMEDIATE EXECUTION
		var module = modules_collection[ id ];

		if( module ) {
			module.initialize.apply( module, params );
			callback.apply( module, params );
			return module;
		}

		fetch_module( id, callback, params );
		return null;
	}

	function get_resources( module_id, resources, callback, force_update ) {
		if( get_type( callback ) === 'boolean' ) {
			force_update = callback;
			callback = do_nothing;
		}

		/*
			resources = {
				templates: ['']
				styles: ['']
				components: ['']
			}
		*/

		console.log( 'fetching resources', resources );
	}

	function get_platform() {
		if( typeof window !== 'undefined' && window.process && window.process.type === "renderer" ) {
			return 'electron';
		}

		return 'web';
	}

	function fetch_module( id, callback, params ) {
		var request = transport[ current_platform ] || do_nothing;
		var context = {
			id: id,
			callback: callback,
			params: params
		};

		request( id, fetch_module_completed, context );
	}

	function fetch_module_completed( data ) {
		var id = this.params;
		var callback = this.callback;
		var params = this.params;

		var module = Module.initialize( data, params );

		if( module ) {
			modules_collection[ id ] = module;
			callback.apply( module, params );
		}
	}

	function fetch_resources( module_id, resources, callback, params ) {
		var request = transport[ current_platform ] || do_nothing;
		var context = {
			id: id,
			callback: callback,
			params: params
		};


	}

	function fetch_resources_completed( data ) {
		console.log( this );
	}

	MAD.get_module = get_module;
	MAD.get_resources = get_resources;

	MAD.api = api;

})( MAD, window, document );