/*!
 * MAD.js - v1.0.0
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

    // var match_guid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    // MODULE CLASS
    var Module = ( function () {

        function module( id ) {
            if ( typeof id !== "string" ) {
                throw new Error( "The module [id] must be a string." );
            }

            this.id = id;
        }

        module.prototype = {
            constructor: module,

            initialize: function () { },

			/* USE CASES
			// .exec( "action_name" )
			// .exec( "action_name", "property=value&..." )
			// .exec( "action_name", "property=value&...", function( response ){} )
			// .exec( "action_name", "property=value&...", function( response, arg1, arg2 ){}, arg1, arg2, ... )
			exec: function(action_name, query, callback) {
				var self = this;
				
				var context = {
					module: self,
					params: arguments,
					callback: callback
				};
				
				mad.request({
					url: "mad/module/" + self.id + '/execute/' + action_name,
					method: "POST",
					data: query,
					
					context: context,
					
					// before_request: before_request,
					// on_success: on_success,
					// on_error: default_exception_handler
					on_complete: on_complete
				});
			}
            */
        };

        function on_complete( exceptions, reply ) {
            var self = this;

            var params = array_splice.call( self.params, 3 );
            var callback = self.callback;

            params.unshift( exceptions, reply );

            callback.apply( self.module, params );
        }

        return module;
    })();

    var Context = ( function () {
        function context( module, resources ) {
            var self = this;

            var module_id = module.id;
            self.resources = resources || {};

            resources.templates = ( resources.templates || {});
            resources.styles = ( resources.styles || {});
            resources.datasets = ( resources.datasets || {});
            resources.components = ( resources.components || {});

            initialize_components( resources );
            register_styles( resources );

            resources.get = function ( resources, callback ) {
                var query = "";

                for ( var resource in resources ) {
                    if ( resources.hasOwnProperty( resource ) ) {
                        query += ( query ? '&' : '' ) + encodeURIComponent( resource ) + '=' + encodeURIComponent( resources[ resource ].join( '|' ) );
                    }
                }

                mad.request( {
                    url: "mad/module/" + module_id + "/resources",
                    data: query,

                    on_success: function ( reply ) {
                        mad.tools.copy( reply.resources, resources, true );
                        initialize_components( resources );

                        callback.call( resources, module, self );
                    }
                });
            };
        }

        function initialize_components( resources ) {
            var components = resources.components;
            var source;

            for ( var item in components ) {
                if ( components.hasOwnProperty( item ) && typeof ( source = components[ item ] ) === "string" ) {
                    try {
                        components[ item ] = new Function( "return (" + source + ");" )();
                    } catch ( exception ) {
                        throw exception;
                    }
                }
            }
        }

        function register_styles( resources ) {
            var styles = resources.styles;
            var head = document.head || document.getElementsByTagName( 'head' )[ 0 ];
            var css;

            for ( var item in styles ) {
                css = styles[ item ];

                if ( styles.hasOwnProperty( item ) ) {
                    style = document.createElement( "style" );
                    style.setAttribute( "type", "text/css" );

                    if ( style.styleSheet ) { // IE
                        style.styleSheet.cssText = css;
                    } else {
                        style.insertBefore( document.createTextNode( css ), null );
                    }

                    head.insertBefore( style, null );
                }
            }
        }

        return context;
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
            if ( !reply ) {
                return;
            }

            var context = this;
            var id = context.module_id;

            var module = reply.module;
            var resources = reply.resources;

            var source = ( module.source || "" ).trim();

            if ( source === "" ) {
                ///#DEBUG
                console.log( "Error: module [" + id + "] not found." );
                ///#ENDDEBUG
                return;
            }

            var module = cached_modules[ id ] = new Module( id );
            var context = new Context( module, resources );
            var wrapper;

            // CACHE THE NEW MODULE INSTANCE
            cached_modules[ id ] = module;

            try {
                wrapper = new Function( "return (" + source + ");" )();
            } catch ( exception ) {
                throw exception;
            }

            // EXECUTE WRAPPER TO INITIALIZE THE SOURCE CODE
            wrapper.call( module, context );

            ///#DEBUG
            console.log( "Initializing module: ", module );
            ///#ENDDEBUG

            module.initialize();

            // return self.callback( self.node_id, self.data );
        }

        function default_exception_handler( exception ) {
            console.log( "ApplicationException: ", exception );
        }

        return request;
    })();

    modules.get = function ( module_id, arg2, arg3 ) {
        var module = cached_modules[ module_id ];
        var callback = arg2;
        var data = arg3;

        if ( mad.tools.get_type( arg2 ) !== "function" ) {
            callback = null;
            data = arg2;
        }

        if ( module && callback ) {
            return callback.call( module, data );
        }

        load_module( module_id, callback, data );
    };

    mad.modules = modules;
    mad.version = "1.0.0";

    win.MAD = mad;
})( window );