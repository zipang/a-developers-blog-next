import React from "react";
import SectionWithBackground from "../SectionWithBackground";
import ReactMarkdown from "react-markdown";
import EmbeddedVideoPlayer from "../../components/EmbeddedVideoPlayer";

import "./one-column-styles.less";

const OneColumn = ({ id, paragraph, video, bg_class, bg_image, overlay }) => (
	<SectionWithBackground
		id={id}
		section_name="one-column"
		bg_class={bg_class}
		bg_image={bg_image}
		overlay={overlay}
	>
		<div className="container">
			<ReactMarkdown>{paragraph}</ReactMarkdown>
			{video && <EmbeddedVideoPlayer video_url={video} />}
		</div>
	</SectionWithBackground>
);

export default OneColumn;
