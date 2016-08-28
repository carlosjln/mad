// POLYFILS
if( !String.prototype.trim ) {
	String.prototype.trim = function () {
		return this.replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '' );
	};
}

( function ( window, utils ) {
	var array_splice = Array.prototype.splice;
	var get_type = utils.get_type;

	// COLLECTIONS
	var cached_modules = {};
	var cached_views = {};
	var shared_module;

	// CLASSES
	var XHR = ( function () {
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
			completed: do_nothing,
			succeeded: do_nothing,
			failed: do_nothing
		};

		function on_ready_state_change( parameters ) {
			var transport = this.transport;
			var ready_state = transport.readyState;
			var context = this.context || this;

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
		}

		function do_nothing() { }

		return xhr;
	})();

	var ResourceCollection = ( function () {
		function main( module_id ) {
			var self = this;

			self.module_id = module_id;

			self.templates = {};
			self.styles = {};
			self.components = {};
		}

		main.prototype = {
			constructor: main,

			update: function ( resources ) {
				if( get_type( resources ) !== 'object' ) {
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
						if( DEBUG ) {
							console.log( 'Exception: unable to process component [' + item + ']' );
						}

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
			self.resources = new ResourceCollection( id );
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
				if( DEBUG ) {
					console.log( 'Exception: module not found [' + id + ']' );
				}
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

				if( DEBUG ) {
					console.log( 'Initializing module: ', instance );
				}

				instance.initialize();

			} catch( exception ) {
				if( DEBUG ) {
					console.log( 'Exception: ', exception );
				}
			}

			return instance;
		};

		return main;
	})();

	var request_module = ( function () {
		function main( module_id, callback, data ) {
			var context = {
				module_id: module_id,
				callback: callback,
				data: data
			};

			return new XHR( {
				url: 'mad/module/' + module_id,

				context: context,

				before: before,
				succeeded: succeeded,
				failed: failed
			});
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

		function failed( exception ) {
			throw exception;
		}

		function do_nothing() { }

		return main;
	})();

	function mad() { }

	function get_module( id, arg2, arg3 ) {
		var module = cached_modules[ id ];
		var callback = arg2;
		var data = arg3;

		if( get_type( arg2 ) !== 'function' ) {
			callback = null;
			data = arg2;
		}

		if( module && callback ) {
			return callback.call( module, data );
		}

		request_module( id, callback, data );
	}

	shared_module = Module.initialize( { id: 'shared', source: 'function shared() {return false;}' });

	mad.get_module = get_module;
	mad.version = '0.0.1';

	window.MAD = mad;
})( window, ( function ( window, document ) {
	// UTILITIES

	// OBJECT TYPE DETECTION
	// TAKEN FROM https://github.com/carlosjln/epic
	var get_type = ( function () {
		var to_string = Object.prototype.toString;

		var core_types = {
			'[object Boolean]': 'boolean',
			'[object Number]': 'number',
			'[object String]': 'string',
			'[object Function]': 'function',
			'[object Array]': 'array',
			'[object Date]': 'date',
			'[object RegExp]': 'regexp',
			'[object Object]': 'object',
			'[object Error]': 'error'
		};

		function type( object ) {
			var typeof_object = typeof ( object );

			if( object === null ) {
				return 'null';
			}

			if( typeof_object === 'object' || typeof_object === 'function' ) {
				return core_types[ to_string.call( object ) ] || 'object';
			}

			return typeof_object;
		}

		return type;
	})();

	// COPYCAT ENGINE B-)
	// TAKEN FROM https://github.com/carlosjln/epic
	function copy( source, target, undefined_only ) {
		var new_value;
		var current_value;
		var source_type = get_type( source );

		undefined_only = undefined_only === true;

		// HANDLE DATE
		if( source_type === 'date' ) {
			target = new Date();
			target.setTime( source.getTime() );

			return target;
		}

		// HANDLE ARRAY
		if( source_type === 'array' && undefined_only === false ) {
			var index = source.length;

			target = target === undefined ? [] : target;

			while( index-- ) {
				target[ index ] = copy( source[ index ], target[ index ], undefined_only );
			}

			return target;
		}

		// HANDLE OBJECTS
		if( source_type === 'object' ) {
			target = target === undefined ? {} : target;

			for( var attribute in source ) {
				if( source.hasOwnProperty( attribute ) ) {
					new_value = source[ attribute ];
					current_value = target[ attribute ];

					target[ attribute ] = copy( new_value, current_value, undefined_only );
				}
			}

			return target;
		}

		// ALSO HANDLES PRIMITIVE TYPES: boolean, number, string, function, error
		return undefined_only ? ( target !== undefined ? target : source ) : source;
	}

	function merge() {
		var objects = arguments;
		var length = objects.length;
		var target = {};
		var i = 0;

		for( ; i < length; i++ ) {
			copy( objects[ i ], target );
		}

		return target;
	}

	function filter( list, condition ) {
		var length = list.length;
		var i = 0;

		var result = [];
		var item;

		for( ; i < length; i++ ) {
			item = list[ i ];

			if( condition( item ) ) {
				result[ result.length ] = item;
			}
		}

		return result;
	}

	// ENCODE/DECODE BASE64
	// TAKEN FROM https://github.com/carlosjln/epic
	var B64KEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	function encode_base64( input ) {
		var key = B64KEY;

		var str = encode_utf8( input );
		var length = str.length;
		var index = 0;

		var output = '';
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;

		while( index < length ) {
			chr1 = str.charCodeAt( index++ );
			chr2 = str.charCodeAt( index++ );
			chr3 = str.charCodeAt( index++ );

			enc1 = chr1 >> 2;
			enc2 = ( ( chr1 & 3 ) << 4 ) | ( chr2 >> 4 );
			enc3 = ( ( chr2 & 15 ) << 2 ) | ( chr3 >> 6 );
			enc4 = chr3 & 63;

			if( isNaN( chr2 ) ) {
				enc3 = enc4 = 64;
			} else if( isNaN( chr3 ) ) {
				enc4 = 64;
			}

			output = output + key.charAt( enc1 ) + key.charAt( enc2 ) + key.charAt( enc3 ) + key.charAt( enc4 );
		}

		return output;
	}

	function encode_utf8( input ) {
		var str = input.replace( /\r\n/g, '\n' );
		var length = str.length;
		var index = 0;

		var output = '';
		var charcode;

		while( length-- ) {
			charcode = str.charCodeAt( index++ );

			if( charcode < 128 ) {
				output += String.fromCharCode( charcode );
			} else if( ( charcode > 127 ) && ( charcode < 2048 ) ) {
				output += String.fromCharCode(( charcode >> 6 ) | 192 );
				output += String.fromCharCode(( charcode & 63 ) | 128 );
			} else {
				output += String.fromCharCode(( charcode >> 12 ) | 224 );
				output += String.fromCharCode(( ( charcode >> 6 ) & 63 ) | 128 );
				output += String.fromCharCode(( charcode & 63 ) | 128 );
			}
		}

		return output;
	}

	function create_style( css ) {
		var style = document.createElement( 'style' );
		style.setAttribute( 'type', 'text/css' );

		if( style.styleSheet ) { // IE
			style.styleSheet.cssText = css;

		} else { // the world
			style.insertBefore( document.createTextNode( css ), null );
		}

		document.getElementsByTagName( 'head' )[ 0 ].insertBefore( style, null );

		return style;
	}

	return {
		get_type: get_type,
		copy: copy,
		merge: merge,
		filter: filter,
		encode_base64: encode_base64,
		encode_utf8: encode_utf8
	};

})( window, document ) );