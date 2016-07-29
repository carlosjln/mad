( function ( mad ) {
	// OBJECT TYPE DETECTION
	// TAKEN FROM https://github.com/carlosjln/epic
	var get_type = ( function () {
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

		var to_string = core_types.toString;

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

	mad.tools = {
		get_type: get_type,
		copy: copy,
		merge: merge,
		filter: filter,
		encode_base64: encode_base64,
		encode_utf8: encode_utf8
	};

})( MAD );