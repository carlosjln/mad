( function ( MAD ) {

	var ResourceCollection = MAD.ResourceCollection;

	function module( id ) {
		if( typeof id !== 'string' ) {
			throw 'The module [id] must be a string.';
		}

		this.id = id;
		this.resources = new ResourceCollection( this );
	}

	module.prototype = {
		constructor: module,

		main: function ( /*user arguments*/ ) {
			// OVERRIDE WITH YOUR OWN CODE IN Module.js
		}
	};

	module.initialize = function ( settings ) {
		var id = settings.id;
		var source = settings.source;
		var resources = settings.resources;

		if( !id || !source ) {
			if( DEBUG ) {
				console.log( 'Exception: module not found [' + id + ']' );
			}

			return null;
		}

		// INITIALIZE AND CACHE THE NEW INSTANCE
		var instance = new module( id );

		// BRACE YOURSELF
		try {
			// REGISTER REQUIRED RESOURCES
			instance.resources.update( resources );

			// EVALUATE THE SOURCE CODE AND MERGE IT WITH THE NEW MODULE INSTANCE 
			( new Function( 'return (' + source + ');' )() ).call( instance, MAD );

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