import React from "react";
import ReactPlayer from "react-player";

import "./video-player-styles.less";

const YOUTUBE_PLAYER_OPTIONS = {
	playerVars: {
		autoplay: 1,
		controls: 1,
		fs: 1,
		showinfo: 0,
		modestbranding: 1,
		playsinline: 1,
		cc_lang_pref: 'jp'
	}
};

const EmbeddedVideoPlayer = ({ video_url, vignette }) => (
	<div className="video-player-wrapper">
		<ReactPlayer
			className="video-player"
			url={video_url}
			light={vignette ? vignette : true}
			playsinline={true}
			config={{
				youtube: YOUTUBE_PLAYER_OPTIONS
			}}
			width="100%"
			height="100%"
		/>
	</div>
);

export default EmbeddedVideoPlayer;
