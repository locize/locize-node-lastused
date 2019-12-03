'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.debounce = debounce;
exports.replaceIn = replaceIn;
exports.isMissingOption = isMissingOption;
exports.optionExist = optionExist;
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

function isMissingOption(obj, props) {
	return props.reduce(function (mem, p) {
		if (mem) return mem;
		if (!obj || !obj[p] || typeof obj[p] !== 'string' || !obj[p].toLowerCase() === p.toLowerCase()) {
			var err = 'i18next-locize-backend :: got "' + obj[p] + '" in options for ' + p + ' which is invalid.';
			console.warn(err);
			return err;
		}
		return false;
	}, false);
}

function optionExist(obj, props) {
	return !isMissingOption(obj, props);
}