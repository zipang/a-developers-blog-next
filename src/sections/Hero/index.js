import React from "react";
import ReactMarkdown from "react-markdown";
import SectionWithBackground from "../SectionWithBackground";
import "./hero-styles.less";

const Hero = ({ title, paragraph, ...background }) => (
	<SectionWithBackground section_name="hero" {...background}>
		<div className="content" key="hero-content">
			<h1>{title}</h1>
			<ReactMarkdown>{paragraph}</ReactMarkdown>
		</div>
	</SectionWithBackground>
);

export default Hero;
