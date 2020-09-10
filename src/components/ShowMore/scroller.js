import progression from "./scroll-to.json";

/**
 *
 * @param {String} eltId
 * @param {Number} offset
 */
const scrollTo = (eltId, offset = 0) => (evt) => {

	if (!requestAnimationFrame) return; // don't bother animating on old browsers

	const w = window;
	const d = document;
	const docElt = d.documentElement;
	const targetElt = d.getElementById(eltId);

	if (!targetElt) return;

	evt.preventDefault();

	const startPos = w.pageYOffset;
	const endPos   = targetElt.getBoundingClientRect().top + startPos - offset;
	// Math.min(
	// 	targetElt.getBoundingClientRect().top - offset,
	// 	docElt.scrollHeight - docElt.clientHeight
	// )
	const delta = endPos - startPos;

	// Pre-calculate all the real scroll position
	const steps = progression.map(m => Math.round(
		startPos + delta*m/1000
	));

	console.log("Scroll steps", steps)

	const animateStep = (i) => () => {
		const scrollPos = steps[i];

		if (scrollPos === undefined) { // end reached
			//d.location.hash = `#${eltId}`;
		} else {
			docElt.scrollTop = scrollPos;
			requestAnimationFrame(animateStep(i+1));
		}
	}

	requestAnimationFrame(animateStep(0));
}
export default scrollTo;
