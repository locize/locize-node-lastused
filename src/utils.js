export function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

export function replaceIn(str, arr, options) {
	let ret = str;
	arr.forEach(s => {
		const regexp = new RegExp(`{{${s}}}`, 'g');
		ret = ret.replace(regexp, options[s]);
	});

	return ret;
}
