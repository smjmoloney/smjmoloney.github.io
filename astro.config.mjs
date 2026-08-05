// @ts-check
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "astro/config";

export default defineConfig({
    integrations: [react()],
    vite: {
        plugins: [
            tailwindcss(),
            VitePWA({
                registerType: "autoUpdate",
                scope: "/threads/",
                manifest: {
                    name: "Thread Tracker",
                    short_name: "ThreadTracker",
                    description:
                        "Keep track of your personal DMC thread collection.",
                    theme_color: "#fafafa",
                    background_color: "#fafafa",
                    display: "standalone",
                    start_url: "/threads/",
                    scope: "/threads/",
                    icons: [
                        {
                            src: "/icons/pwa-192x192.png",
                            sizes: "192x192",
                            type: "image/png",
                        },
                        {
                            src: "/icons/pwa-512x512.png",
                            sizes: "512x512",
                            type: "image/png",
                        },
                    ],
                },
            }),
        ],
    },
    site: "https://smjmoloney.github.io",
});
