function module( shared ) {
	var module = this;
	var resources = module.resources;

	var section;

	module.initialize = function () {
		var template = resources.templates[ "login" ];

		document.body.innerHTML = template;

		section = $( 'section[name=authentication]' );
		section.find( 'form' ).submit( authenticate );

		// SAMPLE FOR GLOBAL STUFF
		// shared.resources.templates["lame-ui"]
    }

	function authenticate( e ) {
		if( e && e.preventDefault ) {
			e.preventDefault()
		}

		alert( "Authenticating..." );
		alert( "Pfsss I lied :P this is just a dummy test" );
		section.hide();
	}
}