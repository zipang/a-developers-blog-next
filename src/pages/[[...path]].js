import { contentDir } from "../../next.config";
import { getStaticPathsFrom } from "../lib/next/FlatFileContentProvider.js";
import Layout from "../components/Layout";

const GenericPage = (...args) => (
	<Layout>
		<main>
			<section className="hero">
				<div className="hero-body container">
					<h2 className="title">Catch all page</h2>
					<div className="content">This page catches all URLs</div>
					<code>
						<pre>{JSON.stringify(args)}</pre>
					</code>
				</div>
			</section>
		</main>
	</Layout>
);

/**
 * Scan all the /content dir to find the path to render as pages
 */
export const getStaticPaths = getStaticPathsFrom(contentDir, "path");

export default GenericPage;
