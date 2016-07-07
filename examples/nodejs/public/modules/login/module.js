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
		// shared.resources.templates["dummy-ui"]
    }

	function authenticate( e ) {
		if( e && e.preventDefault ) {
			e.preventDefault()
		}

		section.find( 'button.submit' ).attr( 'disabled', true ).addClass( 'loading' );

		setTimeout( function () {
			section.hide();
			MAD.modules.get( "dashboard" );
		}, 3000 );
	}
}