// Resolves to a src the browser can render *and* face-api.js can read pixels
// from. Tries the URL directly first, since any host that sends CORS headers
// (Unsplash, most CDNs) needs no help. Only when that fails do we pay for a
// round trip through the proxy, which returns the image as a data URI.
export const resolveImageSrc = async (url) => {
    const canLoadDirectly = await new Promise((resolve) => {
        const probe = new Image();
        probe.crossOrigin = 'anonymous';
        probe.onload = () => resolve(true);
        probe.onerror = () => resolve(false);
        probe.src = url;
    });

    if (canLoadDirectly) return url;

    const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || 'Could not load that image');
    }

    return data.dataURL;
};
