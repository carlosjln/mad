( function ( MAD ) {

	var utils = MAD.utilities;
	var copy = utils.copy;
	var get_type = utils.get_type;

	var XHR = MAD.XHR;
	var create_style = MAD.html.create_style;

	function resource_collection( module_id ) {
		var self = this;

		self.module_id = module_id;

		self.templates = {};
		self.styles = {};
		self.components = {};
	}

	resource_collection.prototype = {
		constructor: resource_collection,

		update: function ( resources ) {
			if( get_type( resources ) !== 'object' ) {
				return;
			};

			var self = this;

			copy( resources.templates, self.templates, true );
			initialize_styles( self.styles, resources.styles );
			initialize_components( self.components, resources.components );
		},

		get: function ( resources, callback ) {
			var query = '';

			for( var resource in resources ) {
				if( resources.hasOwnProperty( resource ) ) {
					query += ( query ? '&' : '' ) + encodeURIComponent( resource ) + '=' + encodeURIComponent( resources[ resource ].join( '|' ) );
				}
			}

			new XHR( {
				url: 'mad/module/' + this.module_id + '/resources',
				data: query,

				context: {
					collection: this,
					callback: callback || do_nothing
				},

				succeeded: succeeded
			});
		}
	};

	function succeeded( reply ) {
		this.update( reply.resources );

		try {
			this.callback.call( this );
		} catch( exception ) {
			throw exception;
		}
	}

	function initialize_styles( collection, new_styles ) {
		var css;
		var element;

		for( var item in new_styles ) {
			css = ( new_styles[ item ] || '' ).trim();

			if( new_styles.hasOwnProperty( item ) && ( element = create_style( css ) ) ) {
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

	function do_nothing() { }

	MAD.ResourceCollection = resource_collection;
})( MAD );