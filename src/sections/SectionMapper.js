import React from "react";

import "./all-sections-styles.less";

import Hero from "./Hero";
import OneColumn from "./OneColumn";
import TwoColumns from "./TwoColumns";
import ThreeColumns from "./ThreeColumns";

const SECTIONS_MAPPING = {
	"hero-intro": Hero,
	"one-column": OneColumn,
	"two-columns-text-image": TwoColumns,
	"three-columns": ThreeColumns,
};
const UNKNOWN_SECTION = (section) => (
	<section>
		<div className="content error">{`Unknown section template : ${
			section.template
		}`}</div>
	</section>
);

const SectionMapper = ({ local, global }) => {
	// Assign an id to each section and pass it to the previous one
	// so that they can link forward to next section
	const sections = local.sections;
	let i = sections.length-1;
	while (i > 0) {
		sections[i-1].nextSectionId = sections[i].id = sections[i].key = `section-${(100+i).toString().substr(1)}`;
		i = i-1;
	}
	sections[0].id = sections[i].key = `intro`;

	return sections.map((section) =>
		(SECTIONS_MAPPING[section.template] || UNKNOWN_SECTION)(section, global)
	);
}

export default SectionMapper;
