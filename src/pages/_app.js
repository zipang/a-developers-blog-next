import "../styles/theme.sass";
import metadata from "../../content/_metadata/index.md";
import headerNavigation from "../../content/_navigation/header-navigation.md";

function MyApp({ Component, pageProps }) {
	const enhancedProps = {
		metadata: metadata.data,
		navigation: {
			header: headerNavigation.data.entries
		},
		...pageProps
	};
	if (typeof window === "undefined") console.dir(enhancedProps);
	return <Component {...enhancedProps} />;
}

export default MyApp;
