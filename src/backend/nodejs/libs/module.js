var FS = require( 'fs' );
var Path = require( 'path' );

var IO = require( './IO' );
var Utils = require( './Utilities' );
var copy = Utils.copy;

require( './Prototypes' );

// RESOURCE MINIFIERS


module.exports = ( function () {
    // ALIASES
    var get_type = Utils.get_type;

    // SHARED VARIABLES
    var module_collection = {};

    var match_url_start = /^\/mad\/module\//ig;
    var match_namespace_joints = /(\.)+/g;

    var match_js_file = /\.js$/i;
    var match_css_file = /\.css$/i;
    var match_html_file = /\.html$/i;

    var match_file_extension = /\.[^/.]+$/;

    var match_dot = /\./g;
    var match_backslash = /\//g;

    function constructor( settings ) {
        initialize( this, settings );
    }

    constructor.prototype = {
        constructor: constructor,

        get_source: function () {
            return IO.get_content( this.path + '/module.js' ) || "";
        },

        get_templates: function () {
            return get_content( this.path, 'resources/templates', match_html_file );
        },

        get_styles: function () {
            return get_content( this.path, 'resources/styles', match_css_file );
        },

        get_components: function () {
            return get_content( this.path, 'resources/components', match_js_file );
        },

        get_model: function function_name( argument ) {
            var self = this;

            var data = {
                module: {
                    id: self.id,
                    namespace: self.namespace,
                    source: self.get_source()
                },

                resources: {
                    templates: self.get_templates(),
                    styles: self.get_styles(),
                    components: self.get_components()
                }
            };

            return data;
        }
    };

    function initialize( module, settings ) {
        var modules_path = settings.modules_path;

        var path = module.path = settings.path;
        var parent_directories = path.replace( modules_path, '' ).split( '/' );
        var directory = parent_directories.splice( -1 )[ 0 ];

        var namespace = ( settings.namespace || parent_directories.join( '.' ) ); // should replace all non alphanumeric characters
        var id = ( settings.id || directory ).replace( match_dot, '_' );

        if ( namespace ) {
            // Should: this be full id path?
            id = namespace + '.' + id;
        }

        // SET MODULE PROPERTIES
        module.id = id;	// TODO: replace non alphanumeric to underscore
        module.namespace = namespace;

        // REMEMBER ORIGINAL SETTINGS
        module.settings = settings;
    }

    function get_content( module_path, resource_path, file_filter ) {
        var path = Path.join( module_path, resource_path );
        var files = IO.get_files( path, file_filter );

        var collection = {};

        var i = files.length;
        var key;
        var file;

        while ( i-- ) {
            file = files[ i ];
            key = file.replace( match_file_extension, '' );

            collection[ key ] = IO.get_content( path + '/' + file ) || "";
        }

        return collection;
    }

    /**
    function get_actions( module ) {
        var actions_path = Path.join( module.path, 'actions' );
        var actions = IO.get_files( actions_path, match_js_file );

        var collection = module.actions;
        var content;

        var i = actions.length;
        var action_name;
        var file;

        while ( i-- ) {
            file = actions[ i ];
            action_name = file.replace( '.js', '' );

            content = IO.get_content( actions_path + '/' + file );
            collection[ action_name ] = new Function( 'return (' + content + ')' )();
        }
    }
    */

    return constructor;
})();

