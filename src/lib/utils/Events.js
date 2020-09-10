/**
 * Wait that functions calls run below a delay of @ms
 * to trigger the function @fn
 * @param {Function} fn - the function to debounce
 * @param {Number} [ms=250] - the delay (in ms) between each function call
 * @param {Object} [ctx] - An optional context to bind the function to
 * @return {Function} that will execute only after the specified delay between calls has elapsed
 */
export const debounce = (fn, ms = 250, ctx) => {
	return function(...args) {
		clearTimeout(fn.hnd);
		fn.hnd = setTimeout(function() {
			fn.apply(ctx, args);
		}, ms);
	};
};

/**
 * Regulate functions calls to be triggered only every `ms` when under stress
 * @param {Function} fn - the function to throttle
 * @param {Number} [ms=250] - the delay (in ms) between each function call
 * @param {Object} [ctx] - An optional context to bind the function to
 * @return {Function} that will execute no more frequently than the specified delay
 */
export const throttle = (fn, ms = 250, ctx) => {
	var last, deferTimer;

	return function(...args) {
		const now = Date.now();
		if (last && now < last + ms) {
			// hold on to it
			clearTimeout(deferTimer);
			deferTimer = setTimeout(function() {
				last = now;
				fn.apply(ctx, args);
			}, ms);
		} else {
			last = now;
			fn.apply(ctx, args);
		}
	};
};

export default { debounce, throttle };
