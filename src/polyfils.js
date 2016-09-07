if( !String.prototype.trim ) {
	String.prototype.trim = function () {
		return this.replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '' );
	};
}

Array.prototype.add = function ( item ) {
	var index = this.length;
	this[ index ] = item;
	return index;
};

Array.prototype.remove = function ( item ) {
	var self = this;
	var index = self.indexOf( item );

	if( index > -1 ) {
		return self.splice( index, 1 )[ 0 ];
	}

	return null;
};

Array.prototype.clear = function () {
	return this.splice( 0, this.length );
};

Array.prototype.get_last = function () {
	var self = this;
	var length = self.length;

	return length ? self[ length - 1 ] : null;
};