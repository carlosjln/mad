( function ( MAD ) {
	var do_nothing = function () { };

	var utilities = MAD.utilities;
	var copy = utilities.copy;
	var get_type = utilities.get_type;
	var set_oid = utilities.set_oid;

	var XHR = MAD.XHR;
	var create_style = MAD.html.create_style;

	var data_storage = {};

	function resource_collection( module ) {
		var oid = set_oid( this );

		this.templates = {};
		this.styles = {};
		this.components = {};

		data_storage[ oid ] = {
			module: module
		};
	}

	resource_collection.prototype = {
		constructor: resource_collection,

		update: function ( resources, override ) {
			if( get_type( resources ) !== 'object' ) {
				return;
			};

			copy( resources.templates, this.templates, !override );
			initialize_styles( this.styles, resources.styles );
			initialize_components( this.components, resources.components );

			return this;
		},

		get: function ( types, callback, force_update ) {
			var instance_data = data_storage[ this.oid ];
			var module = instance_data.module;

			var templates;
			var styles;
			var components;

			if( force_update ) {
				templates = types.templates;
				styles = types.styles;
				components = types.components;
			} else {
				templates = get_undefined( this.templates, types.templates );
				styles = get_undefined( this.styles, types.styles );
				components = get_undefined( this.components, types.components );
			}

			var resources = {
				templates: templates,
				styles: styles,
				components: components
			};

			var context = {
				callback: callback,
				collection: this
			};

			return MAD.api.fetch_resources( module.id, resources, fetch_resources_callback, context );
		}
	};

	// GET RESOURCES
	function fetch_resources_callback( data ) {
		this.callback.call( this.collection.update( data, true ) );
	}

	// function succeeded( reply ) {
	// 	this.update( reply.resources );

	// 	try {
	// 		this.callback.call( this );
	// 	} catch( exception ) {
	// 		throw exception;
	// 	}
	// }

	function initialize_styles( collection, new_styles ) {
		var css;
		var element;
		var current;

		for( var item in new_styles ) {
			css = ( new_styles[ item ] || '' ).trim();

			if( new_styles.hasOwnProperty( item ) && ( element = create_style( css ) ) ) {
				current = collection[ item ];

				if( current ) {
					current.parentNode.removeChild( current );
				}

				collection[ item ] = element;
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

	function get_undefined( object, properties ) {
		if( !properties ) {
			return [];
		}

		var missing = [];
		var index = properties.length;
		var property;

		while( index-- ) {
			property = properties[ index ];

			if( !object[ property ] ) {
				missing.add( property );
			}
		}

		return missing;
	}

	MAD.ResourceCollection = resource_collection;
})( MAD );