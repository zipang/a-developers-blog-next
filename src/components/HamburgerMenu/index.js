import React, { useState } from "react";

import "./hamburger-menu-styles.less";

const HamburgerIcon = ({ size = 38 }) => (
	<svg
		className="hamburger-icon"
		width={size}
		height={size}
		viewBox={`0 0 ${size} ${size}`}
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>Open</title>
		<path className="h t" d="M10.5 10l17 0" />
		<path d="M10.5 19l17 0" />
		<path className="h b" d="M10.5 28l17 0" />
		<path className="x" d="M19 10.5l0 17" />
	</svg>
);

const HamburgerMenuButton = ({ state, toggleMenu, id, ...attrs }) => (
	<button
		id={id}
		{...attrs}
		className={`hamburger-menu-button ${state}`}
		onClick={toggleMenu}
		aria-haspopup="true"
		aria-controls={id.replace("-button", "")}
		aria-expanded={(state === "open")}
	>
		<HamburgerIcon />
	</button>
);

/**
 *
 * @param {String} id
 * @param {Array}  navigationLinks
 */
const HamburgerMenu = ({
	id = "main-navigation",
	navigationLinks = [],
	children
}) => {

	const [state, setState] = useState("closed");
	const toggleMenu = () => setState(state === "closed" ? "open" : "closed");

	return (
		<nav className="menu-nav" id={`${id}`}>

			{children}

			<HamburgerMenuButton
				id={`${id}-menu-button`}
				state={state}
				toggleMenu={toggleMenu}
			/>

			<ul id={`${id}-menu`} className={`menu ${state}`}
				role="menu" aria-labelledby={`${id}-menu-button`}>
				{navigationLinks.map((navItem, i) => (
					<li role="none" key={`menuitem-${i}`}>
						{navItem}
					</li>
				))}
			</ul>
		</nav>
	);
};

export default HamburgerMenuButton;
export { HamburgerMenuButton, HamburgerMenu, HamburgerIcon };
