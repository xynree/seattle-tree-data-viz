import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const repoName = process.env.VITE_REPO_NAME || "seattle-tree-spy";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: `/${repoName}/`,
  build: {
    outDir: "dist",
  },
});
