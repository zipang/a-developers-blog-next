import { useEffect } from "react";
import { error } from "./useIntersectionObserver.json";

/**
 *
 * @param {Ref} root
 * @param {Ref} target
 * @param {Function} onIntersect
 * @param {Number} threshold
 * @param {String} rootMargin
 */
export const useIntersectionObserver = ({
	root,
	target,
	onIntersect,
	threshold = 1.0,
	rootMargin = "0px"
}) => {
	useEffect(() => {
		if (!target) {
			throw new Error(error.NO_TARGET);
		}
		if (!onIntersect) {
			throw new Error(error.NO_EVENT_HANDLER);
		}

		const observer = new IntersectionObserver(onIntersect, {
			root: root ? root.current : null,
			rootMargin,
			threshold
		});

		observer.observe(target.current);

		// Let's clean up after ourselves.
		return () => {
			observer.unobserve(target.current);
		};
	});
};
