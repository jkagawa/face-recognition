# Face Detection

Paste an image URL, upload a photo, or click one of the samples, and the app draws a box around every face it finds.

## How detection works

Detection runs **entirely in the browser** using [@vladmandic/face-api](https://github.com/vladmandic/face-api), a maintained fork of `face-api.js` on modern TensorFlow.js. There's no API key and no per-request cost. (This replaced Clarifai, which shut down its service.)

The model weights live in [`public/models/`](public/models) and are committed to the repo — they're copied from `node_modules/@vladmandic/face-api/model/` and served as static files, so nothing extra has to run at build time. Only the detector is used; the library also ships landmark, expression, and recognition models, which this app doesn't need.

### Why SSD MobileNet v1 and not TinyFaceDetector

The obvious choice is `tinyFaceDetector` — 193KB against 5.6MB. It was measured against the three sample images on the home page and **found zero faces in all of them**, at input sizes 416/512/608 and score thresholds down to 0.2. Those photos have small, tilted, hat-shaded faces, which is exactly where the tiny model gives up. `ssdMobilenetv1` finds them at 0.91–0.96 confidence in well under 100ms per image.

The weights are a one-time cached download, so the size buys a detector that actually works on real photos. If you ever swap back, change both the net and the options in [`src/lib/faceDetection.js`](src/lib/faceDetection.js) and copy the matching weight files into `public/models/`.

Known limitation: faces in **full profile** (looking away from the camera) are not detected — this is a limitation of the model, not the wiring.

## Why there's still a backend

To detect faces, the browser has to read the image's pixels off a canvas, and it only allows that when the image host sends CORS headers. Many hosts don't.

So [`netlify/functions/api.js`](netlify/functions/api.js) exposes `GET /api/proxy?url=…`, which fetches the image server-side and returns it as a data URI. The client ([`src/lib/loadImage.js`](src/lib/loadImage.js)) tries loading the URL directly first and only falls back to the proxy when that fails — so CORS-friendly hosts cost no round trip. Uploaded files never touch the network at all.

Run `npm run dev` to start the React dev server and the Express API together; requests to `/api/*` are proxied to port 3001 in development, and routed by `netlify.toml` in production.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
