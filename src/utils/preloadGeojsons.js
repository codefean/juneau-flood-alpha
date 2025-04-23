/**
 * Preloads a set of .geojson files (levels 65–74) using the appropriate base URL.
 * Uses force-cache to aggressively cache in the browser.
 * Falls back silently if any file is missing (e.g., 73 or 74 not uploaded yet).
 */

export const preloadGeojsons = (hescoMode = false) => {
  const baseURL = hescoMode
    ? "https://flood-data-hesco.s3.us-east-2.amazonaws.com" // still using S3 for hescoMode
    : "https://db41y1hte1zn7.cloudfront.net"; // your new CloudFront distribution

  const levels = Array.from({ length: 10 }, (_, i) => 65 + i); // Levels 65–74

  levels.forEach((level) => {
    const url = `${baseURL}/${level}.geojson`;
    const request = new Request(url, {
      method: "GET",
      cache: "force-cache", // leverage the browser cache aggressively
    });

    fetch(request)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to preload: ${res.statusText}`);
        // No need to parse res.json(); just warming the cache
      })
      .catch((err) => {
        if (err.message.includes("403")) {
          console.info(`GeoJSON not available yet: ${url}`);
        } else {
          console.warn(`Preload failed for ${url}`, err);
        }
      });
  });
};
