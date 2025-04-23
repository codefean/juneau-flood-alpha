export const preloadGeojsons = (hescoMode = false) => {
  const baseURL = hescoMode
    ? "https://flood-data-hesco.s3.us-east-2.amazonaws.com"
    : "https://flood-data.s3.us-east-2.amazonaws.com";

  const levels = Array.from({ length: 10 }, (_, i) => 65 + i); // Levels 65–74

  levels.forEach((level) => {
    const url = `${baseURL}/${level}.geojson`;
    const request = new Request(url, {
      method: "GET",
      cache: "force-cache", // Hint to use cache aggressively
    });

    fetch(request)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to preload: ${res.statusText}`);
        // Not parsing the body — just caching it
      })
      .catch((err) => {
        console.warn(`Preload failed for ${url}`, err);
      });
  });
};
