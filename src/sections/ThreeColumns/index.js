import React from "react";
import SectionWithBackground from "../SectionWithBackground";
import ReactMarkdown from "react-markdown";
import { Link } from "gatsby";
import { Row, Col, Card } from "antd";

import "./three-columns-styles.less";

const isLocalLink = (lnk) => lnk[0] === "/";

const HoverableCard = ({
	title,
	column_image,
	column_content,
	hoverable,
}) => (
	<Card
		title={title}
		hoverable={hoverable}
		cover={column_image && <img src={column_image} alt={title} />}
	>
		<ReactMarkdown>{column_content}</ReactMarkdown>
	</Card>
);

const LinkableCard = ({ link, column_title, ...props }) => {
	return link ? ( // is there a link ?
		isLocalLink(link) ? ( // is it local ? => use Gatsby
			<Link to={link} title={column_title}>
				<HoverableCard hoverable={true} title={column_title} {...props} />
			</Link>
		) : ( // is it absolute => use anchor
			<a href={link} title={column_title}>
				<HoverableCard hoverable={true} title={column_title} {...props} />
			</a>
		)
	) : ( // no link => not hoverable
		<HoverableCard hoverable={false} title={column_title} {...props} />
	);
};

const ThreeColumns = ({
	title,
	columns,
	paragraph,
	...background
}) => (
	<SectionWithBackground
		section_name="three-columns"
		{...background}
	>
		<Row className="container" gutter={36} justify="center">
			<h2>{title}</h2>
			<ReactMarkdown>
				{paragraph ? paragraph + "---" : null}
			</ReactMarkdown>
			{columns.map((col) => (
				<Col span={24} md={8}>
					<LinkableCard {...col} />
				</Col>
			))}
		</Row>
	</SectionWithBackground>
);

export default ThreeColumns;
