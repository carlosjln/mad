function( context ) {
	var module = this;
	
	module.initialize = function() {
		// how to access (preloaded) resources
		var html = context.resources.templates['demo-template'];
		
		//var calendar = new context.resources.component['calendar'];
		
		console.log( context.resources );
		
		// how to access (global) resources
		//context.global.resources.get();
		//context.global.resources.templates['abc-template'];
		
		//this.authenticate();
	};
	
	// USER DEFINED METHODS
	module.authenticate = function() {
		console.log( "executing module.authenticate" );
		var x = "something";
		
		this.exec("authenticate", "A=1&B=2&C=3", auth_callback, "extra1", "extra2", x );
		
		context.get_module( "dashboard" );
	};
	
	function auth_callback( exceptions, reply, extra1, extra2, extra3 ){
		// console.log( "exceptions", exceptions );
		// console.log( "authenticate replied", reply );
		//console.log( "arguments", arguments );
		
		// how to load resources (on demand)
		var required = {
			templates: ['lazy-demo'],
			styles: ['fashion-demo'],
			datasets: ['countries'],
			components: ['demo-ui']
		};
		
		context.resources.get( required , function ( module, context ) {
			console.log( this.templates['lazy-template'] );
		});
	}
	
	function handle_exceptions( exceptions ) {
		// meh, never mind, let the world burn ^_^
	}
}