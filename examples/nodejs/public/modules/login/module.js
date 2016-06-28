function module( context ) {
	var module = this;
	var section;
	
	module.initialize = function() {
		var template = context.resources.templates["login"];
		document.body.innerHTML = template;
		
		section = $('section[name=authentication]');
		
		section.find('form').submit( authenticate );
		
		console.log( "Module context:", context );
	};
	
	function authenticate( e ) {
		if( e && e.preventDefault) {
			e.preventDefault()
		}
		
		alert("Authenticating...");
		alert("Pfsss I lied :P this is just a dummy test");
	}
	
}