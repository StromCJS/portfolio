import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves a project repo from /<repo>/ rather than the domain
// root, so the deploy workflow passes that prefix in as BASE_PATH. Hosts that
// serve from a root — Vercel, a user site, a custom domain — need the default.
const base = process.env.BASE_PATH
  ? `${process.env.BASE_PATH.replace(/\/+$/, "")}/`
  : "/";

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
});
