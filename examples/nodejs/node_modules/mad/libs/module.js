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

        get_model: function function_name( argument ) {
            var self = this;
			var resource_provider = self.resource_provider;

			var required = self.settings.required || {};

			var templates = resource_provider.get_templates( required.templates || [] );
			var styles = resource_provider.get_styles( required.styles || [] );
			var components = resource_provider.get_components( required.components || [] );

            var data = {
                module: {
                    id: self.id,
                    namespace: self.namespace,
                    source: resource_provider.get_source() || ""
                },

                resources: {
                    templates: templates,
                    styles: styles,
                    components: components
                }
            };

            return data;
        }
    };

    return constructor;
})();