# MAD
Modular Application Development

## module.json
The very existence of this file (even if empty) defines the current directory as a module.

Here are some of the settings you can use to define the behavior of your modules.

```javascript
{
    // Is the unique (or global) identifier of the module.
    "id": "module_name"
    
    // Contains the specifications about how the resources of this module should be handled.
    "resources": {

        // Enables cache only for the specified resources.
        // By default nothing is cached.
        "cache": {
            // cache the content of module.js file
            "module": true,
            
            // cache all templates
            "templates": true
            
            // cache specific files
            "templates": ["dashboard"]
            
            // the same applies for [styles] and [components]
        },
        
        // Defines which resources are sent when the module is requested. (Don't panic! you can request individual resources later on)
        "required": {
            // If undefined, all [templates] will be sent.
            // In this case just the template "login.html" will be sent.
            // Note that you don't have to specify the file extension in the template name.
            "templates": ["login"]
            
            // the same applies for [styles] and [components]
        }
    }
}
```

##  module.js
This is where you define the behavior of your module, set event handlers, etc.

```javascript
    function module( shared ) {
        var module = this;
        var resources = module.resources;
        
        module.initialize = function () {
            // accessing resources
            var html = resources.templates[ "login" ];
            
            // the style section contain references to the <style> tags instead of the actual css code
            // all styles are inserted to the DOM automatically 
            var css = resources.styles[ "login" ];
            
            document.body.innerHTML = html;
            
            // access shared/global resources like this (considering it was loaded previously)
            var more_html = shared.resources.templates["generic-view"];
            
            // request data on the fly
            resources.get( { templates: ['lazy-load'] }, function( exception ) {
                if( exception ){
                    throw 'BOOM!';
                }
                
                var even_more_html = this.templates['lazy-load'];
            });
        }
    }
```