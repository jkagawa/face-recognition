import * as faceapi from '@vladmandic/face-api';

const MODEL_URL = `${process.env.PUBLIC_URL}/models`;

// SSD MobileNet v1 rather than TinyFaceDetector: the tiny model is 30x smaller
// but found zero faces in any of the three sample images on the home page
// (small, tilted, hat-shaded faces) at every threshold tried, while this one
// finds them at 0.9+ confidence in well under 100ms.
const detectorOptions = new faceapi.SsdMobilenetv1Options({
    minConfidence: 0.5,
});

let loadPromise = null;

// ~5.6MB of weights, so fetch them once and let every later caller await the
// same promise.
export const loadModels = () => {
    if (!loadPromise) {
        loadPromise = faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    }
    return loadPromise;
};

export const detectFaces = (imageElement) =>
    faceapi.detectAllFaces(imageElement, detectorOptions);

// Detections come back in the image's natural pixel dimensions, but the image
// is displayed at up to 500px wide. resizeResults rescales them, and the boxes
// are then expressed as insets to match the `.bounding-box` CSS.
export const toBoxes = (detections, imageElement) => {
    const width = imageElement.width;
    const height = imageElement.height;

    if (!width || !height) return [];

    return faceapi.resizeResults(detections, { width, height }).map(({ box }) => ({
        leftCol: box.x,
        topRow: box.y,
        rightCol: width - (box.x + box.width),
        bottomRow: height - (box.y + box.height),
    }));
};
