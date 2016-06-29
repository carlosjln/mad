module.exports = ( function () {
    var module_collection = {};

    var match_namespace_joints = /(\.)+/g;
    var match_dot = /\./g;

    function constructor( settings, resource_provider ) {
		var self = this;

		self.settings = settings;
		self.resource_provider = resource_provider;
		
		// SET MODULE PROPERTIES
		module.id = settings.id;
		module.namespace = settings.namespace;
    }

    constructor.prototype = {
        constructor: constructor,

        // get_source: function () {
        //     return IO.get_content( this.path + '/module.js' ) || "";
        // },

        // get_templates: function () {
        //     return get_content( this.path, 'resources/templates', match_html_file );
        // },

        // get_styles: function () {
        //     return get_content( this.path, 'resources/styles', match_css_file );
        // },

        // get_components: function () {
        //     return get_content( this.path, 'resources/components', match_js_file );
        // },

        get_model: function function_name( argument ) {
            var self = this;
			var resource_provider = self.resource_provider;

            var data = {
                module: {
                    id: self.id,
                    namespace: self.namespace,
                    source: resource_provider.get_source() || ""
                },

                resources: {
                    templates: resource_provider.get_templates() || {},
                    styles: resource_provider.get_styles() || {},
                    components: resource_provider.get_components() || {}
                }
            };

            return data;
        }
    };

    return constructor;
})();