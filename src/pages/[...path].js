import { contentDir } from "../../next.config";
import Layout from "../components/Layout";

const AdaptivePage = (...args) => (
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
export async function getStaticPaths() {
	let paths = scanPaths(contentDir);
	return {
		paths: [
			{
				params: {
					paths
				}
			} // See the "paths" section below
		],
		fallback: false // All non existing paths will be handled as 404
	};
}

export default AdaptivePage;
