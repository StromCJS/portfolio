// Vite rewrites absolute asset paths it finds in HTML and CSS, but not ones
// written as string literals in JS. Routing public/ references through
// BASE_URL keeps them correct whether the site is served from a domain root
// or from a /<repo>/ subpath, as GitHub Pages serves a project site.
const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export default asset;
