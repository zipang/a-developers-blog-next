import React from "react";
import ReactPlayer from "react-player";

import "./fullscreen-player-styles.less";

const YOUTUBE_PLAYER_OPTIONS = {
	autoplay: 1,
	controls: 0,
	loop: 1,
	showinfo: 0,
	modestbranding: 1,
	playsinline: 0,
	mute: 1,
	volume: 0
};

const extractVideoId = (videoUrl) => videoUrl.split("/").pop();

/**
 * Add a playlist id equal to the video id to make it loop
 * @see https://stackoverflow.com/questions/13041088/getting-an-embedded-youtube-video-to-auto-play-and-loop
 * @param {String} videoId
 */
const generatePlayersVar = (videoId) => {
	const playerVars = Object.assign(
		{
			playlist: videoId
		},
		YOUTUBE_PLAYER_OPTIONS
	);
	return { playerVars };
};

const FullScreenPlayer = ({ video_url, vignette = false }) => {
	const videoId = extractVideoId(video_url);

	return (
		<ReactPlayer
			className="fullscreen-player"
			key={videoId}
			url={video_url}
			light={vignette ? vignette : false}
			config={{
				youtube: generatePlayersVar(videoId)
			}}
			onClick={() => (this.props.playing = !this.props.playing)}
			playing={true}
			muted={true}
			width="100%"
			height="100%"
		/>
	);
};

export default FullScreenPlayer;
