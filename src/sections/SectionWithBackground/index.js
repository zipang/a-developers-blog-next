import React from "react";
import FullScreenPlayer from "../../components/FullScreenPlayer";
import { Desktop } from "../../components/Responsive";
import ShowMore from "../../components/ShowMore";

const h = React.createElement;

/**
 * The base implementation of every other sections
 * The background can be :
 * - a plain color (white or grey)
 * - an image (fixed or in the flow)
 * - a video in autoplay mode
 *
 * On top of this background, to make the content more readable,
 * we can apply an overlay (color + opacity)
 *
 * Then, the section content (children) is appended
 */
const SectionWithBackground = ({
	id,
	section_name,
	bg_class,
	bg_image,
	bg_video,
	overlay,
	show_more,
	nextSectionId,
	children,
}) => {
	let videoPlayer = null,
		overlayElt = null;

	const props = {
		id: id,
		className: [section_name, bg_class],
		tabIndex: 0,
	};

	if (bg_image) {
		props.style = {
			backgroundImage: `url(${bg_image})`,
		};
	}

	if (bg_class === "video-bg" && bg_video) {
		props.className.push("fullscreen");
		const videoId = bg_video.split("/").pop();
		// Note : this video player must _only_ appear on desktop screens
		// so we use an empty placeholder when it it not here because we had some bug
		// with the video player being recreated in another section (overlay or content) on resizing
		videoPlayer = (
			<div id={`responsive-video-placeholder-${videoId}`}>
				<Desktop>
					<FullScreenPlayer video_url={bg_video} />
				</Desktop>
			</div>
		);
	}

	if (overlay) {
		overlayElt = h("div", {
			className: "overlay",
			style: { backgroundColor: overlay },
			key: `overlay-${section_name}-${overlay}`,
		});
	}

	props.className = props.className.join(" ");

	// Display a bouncing link to next section ?
	const more = (show_more ? ShowMore({ nextSectionId: nextSectionId, offset: 72 }) : undefined)

	return h("section", props, videoPlayer, overlayElt, children, more);
};

export default SectionWithBackground;
