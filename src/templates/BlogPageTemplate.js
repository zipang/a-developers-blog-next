const BlogPageTemplate = ({ title, resume }) => (
	<main>
		<h2>{title}</h2>
		<p>
			This is a blog page about
			<br />
			{resume}
		</p>
	</main>
);

export default BlogPageTemplate;
