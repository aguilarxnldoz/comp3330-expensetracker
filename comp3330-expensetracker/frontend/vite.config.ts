import path from "path";
import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },

    // https://vite.dev/config/server-options
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
            },
        },
    },
});
