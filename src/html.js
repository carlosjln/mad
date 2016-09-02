( function ( MAD, document ) {
	var document_head = document.head || document.getElementsByTagName( 'head' )[ 0 ];

	function create_style( css ) {
		if( !css ) {
			return null;
		}

		var style = document.createElement( 'style' );
		var style_sheet = style.styleSheet;

		style.setAttribute( 'type', 'text/css' );

		// IE
		if( style_sheet ) {
			style_sheet.cssText = css;
		} else {
			// THE WORLD
			style.insertBefore( document.createTextNode( css ), null );
		}

		document_head.insertBefore( style, null );

		return style;
	}

	MAD.html = {
		create_style: create_style
	};

})( MAD, document );