/*!
 * MAD.js
 * Modular Application Development
 * https://github.com/carlosjln/mad
 *
 * Author: Carlos J. Lopez
 * https://github.com/carlosjln
 */

( function ( win ) {
	var array_splice = Array.prototype.splice;

	// COLLECTIONS
	var cached_modules = {};
	var cached_views = {};
	var global_context = {};

	// CLASSES
	var ResourceCollection = ( function () {
		function resource_collection( module ) {
			var self = this;

			self.module_id = module.id;

			self.templates = {};
			self.styles = {};
			self.datasets = {};
			self.components = {};
		}

		resource_collection.prototype = {
			constructor: resource_collection,

			update: function ( resources ) {
				var self = this;
				var copy = mad.tools.copy;

				copy( resources.templates, self.templates, true );
				copy( resources.datasets, self.datasets, true );

				update_styles( resources.styles, self.styles );
				update_components( resources.components, self.components );
			},

			get: function ( resources, callback ) {
				var self = this;
				var query = "";

				for( var resource in resources ) {
					if( resources.hasOwnProperty( resource ) ) {
						query += ( query ? '&' : '' ) + encodeURIComponent( resource ) + '=' + encodeURIComponent( resources[ resource ].join( '|' ) );
					}
				}

				mad.request( {
					url: "mad/module/" + self.module_id + "/resources",
					data: query,

					on_success: function ( reply ) {
						self.update( reply.resources );

						if( typeof callback === "function" ) {
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

		function update_styles( raw_styles, collection ) {
			var head = document.head || document.getElementsByTagName( 'head' )[ 0 ];
			var css;

			for( var item in raw_styles ) {
				css = raw_styles[ item ];

				if( raw_styles.hasOwnProperty( item ) ) {
					style = document.createElement( "style" );
					style.setAttribute( "type", "text/css" );

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

		function update_components( raw_components, collection ) {
			var source;

			for( var item in raw_components ) {
				if( raw_components.hasOwnProperty( item ) && typeof ( source = raw_components[ item ] ) === "string" ) {
					try {
						collection[ item ] = new Function( "return (" + source + ");" )();
					} catch( exception ) {
						throw exception;
					}
				}
			}
		}

		return resource_collection;
	})();

	var Module = ( function () {
		function module( id ) {
			if( typeof id !== "string" ) {
				throw "The module [id] must be a string.";
			}

			var self = this;

			self.id = id;
			self.resources = new ResourceCollection( self );
		}

		module.prototype = {
			constructor: module,

			initialize: function () {
				// DEFAULT INITIALIZATION METHOD, OVERRIDE WITH YOUR OWN CODE.
			},
		};

		return module;
	})();

	function mad() { }

	function modules() {
		return cached_modules;
	}

	// SOME HELPERS
	var load_module = ( function () {
		function request( module_id, callback, data ) {
			//requested_handlers[ module_id ] = true;

			var context = {
				module_id: module_id,
				callback: callback,
				data: data
			};

			mad.request( {
				url: "mad/module/" + module_id,

				context: context,

				before_request: before_request,
				on_success: on_success,
				on_error: default_exception_handler
			});
		}

		function before_request() {
			///#DEBUG
			console.log( "Requesting module: ", this.module_id );
			///#ENDDEBUG
		}

		function on_success( reply ) {
			if( !reply ) {
				return;
			}

			var self = this;
			var module_id = self.module_id;

			var module_data = reply.module;
			var source = ( module_data.source || "" ).trim();

			if( source === "" ) {
				///#DEBUG
				console.log( "Error: module [" + module_id + "] not found." );
				///#ENDDEBUG
				return;
			}

			// INITIALIZE AND CACHE THE NEW INSTANCE
			var module = cached_modules[ module_id ] = new Module( module_id );

			// -MINE FIELD-
			// ANYTHING CAN GO WRONG FROM THIS POINT ON 
			try {
				// EVALUATE THE SOURCE CODE AND MERGE IT WITH THE NEW MODULE INSTANCE 
				( new Function( "return (" + source + ");" )() ).call( module, { shared: true });

				// REGISTER REQUIRED RESOURCES
				module.resources.update( reply.resources );

				///#DEBUG
				console.log( "Initializing module: ", module );
				///#ENDDEBUG

				module.initialize();
			} catch( exception ) {
				throw exception;
			}
		}

		function default_exception_handler( exception ) {
			throw exception;
		}

		return request;
	})();

	modules.get = function ( module_id, arg2, arg3 ) {
		var module = cached_modules[ module_id ];
		var callback = arg2;
		var data = arg3;

		if( mad.tools.get_type( arg2 ) !== "function" ) {
			callback = null;
			data = arg2;
		}

		if( module && callback ) {
			return callback.call( module, data );
		}

		load_module( module_id, callback, data );
	};

	mad.modules = modules;
	mad.version = "0.0.1";

	win.MAD = mad;
})( window );