function module( context ) {
	var module = this;
	var section;
	
	module.initialize = function() {
		var template = context.resources.templates["login"];
		document.body.innerHTML = template;
		
		section = $('section[name=authentication]');
		
		section.find('form').submit( module.authenticate );
		
		console.log( "Module context:", context );
	};
	
	// USER DEFINED METHODS
	module.authenticate = authenticate;
	
	function authenticate( e ) {
		if( e && e.preventDefault) {
			e.preventDefault()
		}
		
		/*
		this.exec("authenticate", "user=1&password=2", auth_callback, "extra1", "extra2" );
		context.get_module( "dashboard" );
		*/
		
		alert("Authenticating...");
		alert("Pfsss I lied :P this is just a dummy test");
	}
	
	function auth_callback( exceptions, reply, extra1, extra2, extra3 ){
		/*
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
		*/
	}
	
	function handle_exceptions( exceptions ) {
		// meh, never mind, let the world burn ^_^
	}
}