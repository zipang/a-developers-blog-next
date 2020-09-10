import React from "react";
import "./video-container-styles.less";

// const ytParams = {
// 	rel: 0,
// 	origin: origin,
// 	autoplay: 1,
// 	controls: 0,
// 	loop: 1,
// 	enablejsapi: 1,
// 	widgetid: 1,
// };

/**
 * Open a modal with the video playing inside an iframe
 * @param {DOMEvent} evt
 */
const openVideo = (evt) => {
	evt.preventDefault();
}

const VideoContainer = ({ title, videoUrl, vignette, origin }) => (
	<div class="video-container">
		{vignette ? (
			<a className="video content" href={videoUrl} onClick={openVideo}>
				<h2>{title}</h2>
				<img src={vignette} alt={title} />
			</a>
		) : (
			<iframe
				className="video-player"
				allowfullscreen="1"
				allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
				title={title}
				src="{videoUrl}?rel=0&amp;origin={siteUrl}&amp;autoplay=1&amp;controls=0&amp;loop=1&amp;enablejsapi=1&amp;widgetid=1"
				width="560"
				height="315"
				frameborder="0"
			/>
		)}
	</div>
);

export default VideoContainer;
