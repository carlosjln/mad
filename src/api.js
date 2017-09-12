( function ( mad, window ) {

	var Module = mad.Module;
	var XHR = mad.XHR;

	var utilities = mad.utilities;
	var get_type = utilities.get_type;
	var generate_uid = utilities.generate_uid;

	var modules_collection = {};
	var current_platform = get_platform();

	var do_nothing = function () { };
	var transport = {};

	var api = {
		transport: transport,
		fetch_module: fetch_module,
		fetch_resources: fetch_resources
	};

	function fetch_module( id, callback, context ) {
		return transport[ current_platform ].fetch_module( id, callback, context );
	}

	function fetch_resources( module_id, types, callback, context ) {
		return transport[ current_platform ].fetch_resources( module_id, types, callback, context );
	}

	// GET MODULE
	function get_module( id, callback, params ) {
		callback = callback || do_nothing;

		if( get_type( callback ) !== 'function' ) {
			params = callback;
			callback = do_nothing;
		}

		params = params === void 0 ? [] : params;
		params = get_type( params ) === 'array' ? params : [ params ];

		// IMMEDIATE EXECUTION
		var module = modules_collection[ id ];

		if( module ) {
			module.main.apply( module, params );
			callback.apply( module, params );

			return module;
		}

		var context = {
			id: id,
			callback: callback,
			params: params
		};

		fetch_module( id, fetch_module_callback, context );
	}

	function fetch_module_callback( data ) {
		var id = this.id;
		var callback = this.callback;
		var params = this.params;

		var module = Module.initialize( data, params );

		if( module ) {
			modules_collection[ id ] = module;

			module.main.apply( module, params );
			callback.apply( module, params );
		}
	}

	// LOCAL UTILITIES
	function get_platform() {
		if( typeof window !== 'undefined' && window.process && window.process.type === "renderer" ) {
			return 'electron';
		}

		return 'web';
	}

	mad.get_module = get_module;
	mad.api = api;

})( window.mad, window, document );