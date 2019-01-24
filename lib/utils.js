'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.debounce = debounce;
exports.replaceIn = replaceIn;
function debounce(func, wait, immediate) {
	var timeout;
	return function () {
		var context = this,
		    args = arguments;
		var later = function later() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function replaceIn(str, arr, options) {
	var ret = str;
	arr.forEach(function (s) {
		var regexp = new RegExp('{{' + s + '}}', 'g');
		ret = ret.replace(regexp, options[s]);
	});

	return ret;
}