/**
 * Bezier code taken from Stephen McKamey :
 * https://gist.github.com/mckamey/3783009
 */

/**
 * Duration value to use when none is specified.
 * @type {number} ms
 */
const DEFAULT_DURATION = 1000;

/**
 * The epsilon value we pass to createBezierFunc::solve given
 * that the animation is going to run over |dur| seconds.
 * The longer the animation, the more precision we need
 * in the timing function result to avoid ugly discontinuities.
 * @see http://svn.webkit.org/repository/webkit/trunk/Source/WebCore/page/animation/AnimationBase.cpp
 */
const solveEpsilon = function(duration) {
	return 1.0 / (200.0 * duration);
};

/**
 * Defines a cubic-bezier curve given the middle two control points.
 * NOTE: first and last control points are implicitly (0,0) and (1,1).
 * @param p1x {number} X component of control point 1
 * @param p1y {number} Y component of control point 1
 * @param p2x {number} X component of control point 2
 * @param p2y {number} Y component of control point 2
 * @returns {Function(x, duration)} A cubic bezier function defined on [O, 1] for these control points
 */
const bezier = function(p1x, p1y, p2x, p2y) {

	// private members --------------------------------------------

	// Calculate the polynomial coefficients, implicit first and last control points are (0,0) and (1,1).

	/**
	 * X component of Bezier coefficient C
	 * @const
	 * @type {number}
	 */
	const cx = 3.0 * p1x;

	/**
	 * X component of Bezier coefficient B
	 * @const
	 * @type {number}
	 */
	const bx = 3.0 * (p2x - p1x) - cx;

	/**
	 * X component of Bezier coefficient A
	 * @const
	 * @type {number}
	 */
	const ax = 1.0 - cx -bx;

	/**
	 * Y component of Bezier coefficient C
	 * @const
	 * @type {number}
	 */
	const cy = 3.0 * p1y;

	/**
	 * Y component of Bezier coefficient B
	 * @const
	 * @type {number}
	 */
	const by = 3.0 * (p2y - p1y) - cy;

	/**
	 * Y component of Bezier coefficient A
	 * @const
	 * @type {number}
	 */
	const ay = 1.0 - cy - by;

	/**
	 * @param t {number} parametric timing value
	 * @return {number}
	 */
	const sampleCurveX = function(t) {
		// `ax t^3 + bx t^2 + cx t' expanded using Horner's rule.
		return ((ax * t + bx) * t + cx) * t;
	};

	/**
	 * @param t {number} parametric timing value
	 * @return {number}
	 */
	const sampleCurveY = function(t) {
		return ((ay * t + by) * t + cy) * t;
	};

	/**
	 * @param t {number} parametric timing value
	 * @return {number}
	 */
	const sampleCurveDerivativeX = function(t) {
		return (3.0 * ax * t + 2.0 * bx) * t + cx;
	};

	/**
	 * Given an x value, find a parametric value it came from.
	 * @param x {number} value of x along the bezier curve, 0.0 <= x <= 1.0
	 * @param epsilon {number} accuracy limit of t for the given x
	 * @return {number} the t value corresponding to x
	 */
	const solveCurveX = function(x, epsilon) {
		var t0;
		var t1;
		var t2;
		var x2;
		var d2;
		var i;

		// First try a few iterations of Newton's method -- normally very fast.
		for (t2 = x, i = 0; i < 8; i++) {
			x2 = sampleCurveX(t2) - x;
			if (Math.abs (x2) < epsilon) {
				return t2;
			}
			d2 = sampleCurveDerivativeX(t2);
			if (Math.abs(d2) < 1e-6) {
				break;
			}
			t2 = t2 - x2 / d2;
		}

		// Fall back to the bisection method for reliability.
		t0 = 0.0;
		t1 = 1.0;
		t2 = x;

		if (t2 < t0) {
			return t0;
		}
		if (t2 > t1) {
			return t1;
		}

		while (t0 < t1) {
			x2 = sampleCurveX(t2);
			if (Math.abs(x2 - x) < epsilon) {
				return t2;
			}
			if (x > x2) {
				t0 = t2;
			} else {
				t1 = t2;
			}
			t2 = (t1 - t0) * 0.5 + t0;
		}

		// Failure.
		return t2;
	};

	/**
	 * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
	 * @param epsilon {number} the accuracy of t for the given x
	 * @return {number} the y value along the bezier curve
	 */
	const solve = function(x, epsilon) {
		return sampleCurveY(solveCurveX(x, epsilon));
	};

	// public interface --------------------------------------------

	/**
	 * Find the y of the cubic-bezier for a given x with accuracy determined by the animation duration.
	 * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
	 * @param duration {number} the duration of the animation in milliseconds
	 * @return {number} the y value along the bezier curve
	 */
	return function(x, duration) {
		return solve(x, solveEpsilon(+duration || DEFAULT_DURATION));
	};
}

module.exports = bezier;
