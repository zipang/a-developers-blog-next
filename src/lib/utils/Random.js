/**
 * Some super fancy random utils
 */
const Random = {

	/**
	 * Picks an integer between the specified min and max (included)
	 * @example
	 * return Random.integer(0, 100);
	 * @param {Number} min 
	 * @param {Number} max 
	 * @returns {Number}
	 */
	integer: function (min, max) {
		return min + Math.round(Math.random() * (max - min));
	},
	/**
	 * Choose a random element inside the provided array
	 * @param {Array[any]} arr 
	 * @returns {any}
	 */
	pick: function (arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	},
	/**
	 * return TRUE or FALSE randomly
	 * @returns {Boolean}
	 */
	truth: function () {
		return Random.pick([true, false]);
	}
}

export default Random;
