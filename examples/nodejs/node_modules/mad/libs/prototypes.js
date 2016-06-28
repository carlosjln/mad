Array.prototype.get_last = function () {
	var t = this;
	var length = t.length;

	return length ? t[ length - 1 ] : null;
};