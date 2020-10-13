import { contentDir } from "../../next.config.js";
import {
	getStaticPathsFrom,
	getStaticPropsFor
} from "../lib/next/FlatFileContentProvider.js";
import Layout from "../components/Layout";
import ReactMarkdown from "react-markdown";

const GenericPage = ({ data, content }) => (
	<Layout>
		<main>
			<section className="hero">
				<div className="hero-body container">
					<h2 className="title">Catch all pages</h2>
					<div className="content">This page catches all URLs</div>
					<code>
						<pre>{JSON.stringify(data)}</pre>
					</code>
					<ReactMarkdown source={content}></ReactMarkdown>
				</div>
			</section>
		</main>
	</Layout>
);

/**
 * Scan all the /content dir to find the path to render as pages
 */
export const getStaticPaths = getStaticPathsFrom(contentDir, "path");

/**
 * Read the `path` params which gives the route to the markdown file to load
 * And return the file content as props
 */
export const getStaticProps = getStaticPropsFor(contentDir, "path");

export default GenericPage;
