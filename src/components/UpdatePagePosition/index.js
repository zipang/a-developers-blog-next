import { useEffect } from "react";
import throttle from "../../utils/throttle";

const UpdatePagePosition = ({ pageScroll, updateScroll, ...etc }) => {

	/**
	 * Update the scroll position and any custom property that can be calculated from it
	 */
	const updateScrollPosition = () => {

		const w = window, docElt = document.documentElement;
		const scrollTop = w.pageYOffset || docElt.scrollTop;

		// update scrolltop
		const updated = { ...pageScroll, scrollTop };

		// update custom properties calculated from scroll position
		for (const propertyName in etc) {
			updated[propertyName] = etc[propertyName](scrollTop);
		}

		updateScroll(updated);
	};

	// Hook to to componentDidMount and componentDidUpdate:
	useEffect(() => {
		updateScrollPosition();
		const debounced = throttle(updateScrollPosition, 100);
		window.addEventListener("scroll", debounced);
		// this is to unregister after component is unmounted
		return () => window.removeEventListener("scroll", debounced);
	}, []); // <= passing an empty array here is extremely important to prevent the useEffect hook to be called and called again...

	return null;
};

export default UpdatePagePosition;
