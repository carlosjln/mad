( function ( MAD ) {

	var ResourceCollection = MAD.ResourceCollection;

	function module( id ) {
		if( typeof id !== 'string' ) {
			throw 'The module [id] must be a string.';
		}

		this.id = id;
		this.resources = new ResourceCollection( id );
	}

	module.prototype = {
		constructor: module,

		initialize: function () {
			// OVERRIDE WITH YOUR OWN CODE IN Module.js
		},
	};

	module.initialize = function ( settings, params ) {
		var id = settings.id;
		var source = settings.source;
		var resources = settings.resources;

		if( !id || !source ) {
			if( DEBUG ) {
				console.log( 'Exception: module not found [' + id + ']' );
			}
			return;
		}

		// INITIALIZE AND CACHE THE NEW INSTANCE
		var instance = new module( id );

		// BRACE YOURSELF
		try {
			// REGISTER REQUIRED RESOURCES
			instance.resources.update( resources );

			// EVALUATE THE SOURCE CODE AND MERGE IT WITH THE NEW MODULE INSTANCE 
			( new Function( 'return (' + source + ');' )() ).call( instance, MAD );

			// if( DEBUG ) {
			// 	console.log( 'Initializing module: ', instance );
			// }

			instance.initialize.apply( instance, params );

		} catch( exception ) {
			if( DEBUG ) {
				console.log( 'Exception: ', exception );
			}

			return null;
		}

		return instance;
	};

	MAD.Module = module;

})( MAD );