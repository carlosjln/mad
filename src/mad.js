/*!
 * MAD.js
 * Modular Application Development
 * https://github.com/carlosjln/mad
 *
 * Author: Carlos J. Lopez
 * https://github.com/carlosjln
 */

/**
 * POLYFILS
 */
if( !String.prototype.trim ) {
	String.prototype.trim = function () {
		return this.replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '' );
	};
}

( function ( win ) {
	var array_splice = Array.prototype.splice;

	// COLLECTIONS
	var cached_modules = {};
	var cached_views = {};
	var shared_module;

	var get_type = Object.prototype.toString;

	// CLASSES
	var ResourceCollection = ( function () {
		function main( module ) {
			var self = this;

			self.module_id = module.id;

			self.templates = {};
			self.styles = {};
			self.components = {};
		}

		main.prototype = {
			constructor: main,

			update: function ( resources ) {
				if( get_type.call( resources ) !== '[object Object]' ) {
					return;
				};

				var self = this;
				var copy = mad.tools.copy;

				copy( resources.templates, self.templates, true );
				initialize_styles( self.styles, resources.styles );
				initialize_components( self.components, resources.components );
			},

			get: function ( resources, callback ) {
				var self = this;
				var query = '';

				for( var resource in resources ) {
					if( resources.hasOwnProperty( resource ) ) {
						query += ( query ? '&' : '' ) + encodeURIComponent( resource ) + '=' + encodeURIComponent( resources[ resource ].join( '|' ) );
					}
				}

				mad.request( {
					url: 'mad/module/' + self.module_id + '/resources',
					data: query,

					on_success: function ( reply ) {
						self.update( reply.resources );

						if( typeof callback === 'function' ) {
							try {
								callback.call( resources );
							} catch( exception ) {
								throw exception;
							}
						}
					}
				});
			}
		};

		function initialize_styles( collection, new_styles ) {
			var head = document.head || document.getElementsByTagName( 'head' )[ 0 ];
			var css;

			for( var item in new_styles ) {
				css = ( new_styles[ item ] || '' ).trim();

				if( !css ) {
					continue;
				}

				if( new_styles.hasOwnProperty( item ) ) {
					style = document.createElement( 'style' );
					style.setAttribute( 'type', 'text/css' );

					if( style.styleSheet ) { // IE
						style.styleSheet.cssText = css;
					} else {
						style.insertBefore( document.createTextNode( css ), null );
					}

					head.insertBefore( style, null );

					collection[ item ] = style;
				}
			}
		}

		function initialize_components( collection, new_components ) {
			var source;
			var item;

			for( item in new_components ) {
				source = new_components[ item ];

				if( !source ) {
					continue;
				}

				if( typeof ( source ) === 'string' && new_components.hasOwnProperty( item ) ) {
					try {
						collection[ item ] = new Function( 'return (' + source + ');' )();
					} catch( exception ) {
						console.log( 'Exception: unable to process component [' + item + ']' );
						throw exception;
					}
				}
			}
		}

		return main;
	})();

	var Module = ( function () {
		function main( id ) {
			if( typeof id !== 'string' ) {
				throw 'The module [id] must be a string.';
			}

			var self = this;

			self.id = id;
			self.resources = new ResourceCollection( self );
		}

		main.prototype = {
			constructor: main,

			initialize: function () {
				// OVERRIDE WITH YOUR OWN CODE IN Module.js
			},
		};

		main.initialize = function ( settings ) {
			var id = settings.id;
			var source = settings.source;
			var resources = settings.resources;

			if( !id || !source ) {
				///#DEBUG
				console.log( 'Exception: module not found [' + id + ']' );
				///#ENDDEBUG
				return;
			}

			// INITIALIZE AND CACHE THE NEW INSTANCE
			var instance = new Module( id );

			// -MINE FIELD-
			// ANYTHING CAN GO WRONG FROM THIS POINT ON 
			try {
				// EVALUATE THE SOURCE CODE AND MERGE IT WITH THE NEW MODULE INSTANCE 
				( new Function( 'return (' + source + ');' )() ).call( instance, shared_module );

				// REGISTER REQUIRED RESOURCES
				instance.resources.update( resources );

				///#DEBUG
				console.log( 'Initializing module: ', instance );
				///#ENDDEBUG

				instance.initialize();
			} catch( exception ) {
				console.log( 'Exception: ', exception );
			}

			return instance;
		};

		return main;
	})();

	var load_module = ( function () {
		function request( module_id, callback, data ) {
			var context = {
				module_id: module_id,
				callback: callback,
				data: data
			};

			mad.request( {
				url: 'mad/module/' + module_id,

				context: context,

				before_request: before_request,
				on_success: on_success,
				on_error: default_exception_handler
			});
		}

		function before_request() {
			///#DEBUG
			console.log( 'Requesting module: ', this.module_id );
			///#ENDDEBUG
		}

		function on_success( reply ) {
			if( !reply ) {
				return console.log( 'Exception: Module could not be loaded.' );
			}

			if( reply.exception ) {
				return console.log( 'Exception: ' + ( reply.exception || 'Module could not be loaded.' ) );
			}

			var self = this;

			var id = self.module_id;
			var module = Module.initialize( reply );

			if( module ) {
				cached_modules[ id ] = module;

				var data = self.data;
				var params = ( data instanceof Array ? data : [ data ] );

				if( data == undefined ) {
					params = undefined;
				}

				( this.callback || do_nothing ).apply( module, params );
			}
		}

		function default_exception_handler( exception ) {
			throw exception;
		}

		function do_nothing() { }

		return request;
	})();

	function mad() { }

	function modules() {
		return cached_modules;
	}

	modules.get = function ( module_id, arg2, arg3 ) {
		var module = cached_modules[ module_id ];
		var callback = arg2;
		var data = arg3;

		if( get_type.call( arg2 ) !== '[object Function]' ) {
			callback = null;
			data = arg2;
		}

		if( module && callback ) {
			return callback.call( module, data );
		}

		load_module( module_id, callback, data );
	};

	shared_module = Module.initialize( { id: 'shared', source: 'function shared() {return false;}' });

	mad.modules = modules;
	mad.version = '0.0.1';

	win.MAD = mad;
})( window );