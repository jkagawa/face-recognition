const serverless = require('serverless-http');

const express = require('express');
const app = express();

app.use(express.json({ limit: '10mb' }));

const port = process.env.PORT || 3001;

// Netlify caps function responses at 6MB, and base64 inflates by ~33%.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

// Hosts that resolve to the machine running this function, or to anything
// inside a private network, are off limits - the proxy would otherwise be an
// open door to whatever else lives there.
const isBlockedHost = (hostname) => {
    const host = hostname.toLowerCase();
    if (host === 'localhost' || host.endsWith('.localhost') || host === '::1') return true;
    if (/^127\./.test(host)) return true;
    if (/^10\./.test(host)) return true;
    if (/^192\.168\./.test(host)) return true;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return true;
    if (/^169\.254\./.test(host)) return true;
    return false;
};

// face-api.js needs to read the image's pixels off a canvas, which the browser
// only permits when the image host sends CORS headers. Plenty don't. This
// fetches the image server-side (no CORS involved) and hands it back as a data
// URI, which is same-origin by definition and so always readable.
app.get('/api/proxy', async (req, res) => {
    const value = req.query.url;

    if (!value) {
        return res.status(400).json({ error: 'No image URL provided' });
    }

    let target;
    try {
        target = new URL(value);
    } catch {
        return res.status(400).json({ error: "That doesn't look like a valid URL" });
    }

    if (target.protocol !== 'http:' && target.protocol !== 'https:') {
        return res.status(400).json({ error: 'Only http and https URLs are supported' });
    }

    if (isBlockedHost(target.hostname)) {
        return res.status(400).json({ error: 'That address is not reachable' });
    }

    try {
        const response = await fetch(target.href, {
            headers: { 'User-Agent': 'face-detection-app' },
            redirect: 'follow',
            signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
            return res
                .status(502)
                .json({ error: `The image host responded with ${response.status}` });
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.startsWith('image/')) {
            return res.status(415).json({ error: "That URL doesn't point to an image" });
        }

        const declaredLength = Number(response.headers.get('content-length'));
        if (declaredLength > MAX_IMAGE_BYTES) {
            return res.status(413).json({ error: 'That image is too large (max 4MB)' });
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        if (buffer.length > MAX_IMAGE_BYTES) {
            return res.status(413).json({ error: 'That image is too large (max 4MB)' });
        }

        const mimeType = contentType.split(';')[0].trim();
        res.json({ dataURL: `data:${mimeType};base64,${buffer.toString('base64')}` });
    } catch (error) {
        console.log('proxy error', error);
        const timedOut = error.name === 'TimeoutError' || error.name === 'AbortError';
        res.status(504).json({
            error: timedOut ? 'The image host took too long to respond' : 'Could not fetch that image',
        });
    }
});

app.get('/api/test', (req, res) => {
    res.send("Test is successful!");
});

app.listen(port, () => {
    console.log(`Express API listening at http://localhost:${port}`);
});

exports.handler = serverless(app);
