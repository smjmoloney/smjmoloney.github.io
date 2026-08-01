import { generateSW } from "workbox-build";

const { count, size, warnings } = await generateSW({
    globDirectory: "dist",
    globPatterns: ["**/*.{html,js,css,webmanifest,ico,svg,png}"],
    globIgnores: ["sw.js", "workbox-*.js"],
    swDest: "dist/sw.js",
    navigateFallback: "/index.html",
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true,
});

for (const warning of warnings) {
    console.warn(`[workbox] ${warning}`);
}

console.log(
    `[workbox] Generated dist/sw.js with ${count} precached files (${size} bytes).`,
);