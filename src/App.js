import { useCallback, useEffect, useRef, useState } from 'react';
import ImageSearchForm from "./Components/ImageSearchForm";
import FaceDetect from "./Components/FaceDetect";
import ImageSelection from './Components/ImageSelection';
import Message from './Components/Message';
import { loadModels, detectFaces, toBoxes } from './lib/faceDetection';
import { resolveImageSrc } from './lib/loadImage';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [boxes, setBoxes] = useState([]);
  const [message, setMessage] = useState(null);
  const [isBusy, setIsBusy] = useState(false);

  // Kept so boxes can be recomputed on resize without running detection again.
  const detectionsRef = useRef([]);
  const imageRef = useRef(null);
  // Guards against a slow image finishing after the user picked a different one.
  const requestRef = useRef(0);

  useEffect(() => {
    loadModels().catch(() => {
      setMessage({ tone: 'error', text: 'Could not load the face detection model. Try reloading the page.' });
    });
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (imageRef.current && detectionsRef.current.length) {
        setBoxes(toBoxes(detectionsRef.current, imageRef.current));
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const startNewImage = () => {
    setBoxes([]);
    setMessage(null);
    detectionsRef.current = [];
    // Clearing the src unmounts the <img>, so re-picking the same image still
    // produces a fresh load event to hang detection off of.
    setImageURL('');
    return ++requestRef.current;
  };

  const onInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const onSubmit = async (value) => {
    if (!value) {
      setMessage({ tone: 'error', text: 'Please insert the URL of an image' });
      return;
    }

    const request = startNewImage();
    setIsBusy(true);

    try {
      const src = await resolveImageSrc(value);
      if (request !== requestRef.current) return;
      setImageURL(src);
    } catch (error) {
      if (request !== requestRef.current) return;
      setImageURL('');
      setIsBusy(false);
      setMessage({ tone: 'error', text: error.message });
    }
  };

  const onImageUpload = (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ tone: 'error', text: 'Please upload an image under 2MB.' });
      return;
    }

    const request = startNewImage();
    setIsBusy(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (request !== requestRef.current) return;
      setImageURL(e.target.result);
    };
    reader.onerror = () => {
      if (request !== requestRef.current) return;
      setIsBusy(false);
      setMessage({ tone: 'error', text: 'Could not read that file.' });
    };
    reader.readAsDataURL(file);
  };

  // Detection waits for the image's own load event, so the element always has
  // real dimensions to scale the boxes against.
  const onImageLoad = useCallback(async (imageElement) => {
    const request = requestRef.current;
    imageRef.current = imageElement;

    try {
      await loadModels();
      const detections = await detectFaces(imageElement);
      if (request !== requestRef.current) return;

      detectionsRef.current = detections;
      setBoxes(toBoxes(detections, imageElement));

      if (!detections.length) {
        setMessage({ tone: 'info', text: 'No faces found in this image.' });
      }
    } catch (error) {
      if (request !== requestRef.current) return;
      setMessage({ tone: 'error', text: 'Something went wrong while detecting faces.' });
    } finally {
      if (request === requestRef.current) setIsBusy(false);
    }
  }, []);

  // onLoad never fires for an image the browser can't decode, so the busy
  // state needs releasing here too.
  const onImageError = useCallback(() => {
    setIsBusy(false);
    setImageURL('');
    setMessage({ tone: 'error', text: 'That image could not be displayed.' });
  }, []);

  return (
    <div className="App min-h-screen">
      <header className="pt-14 pb-2">
        <h1 className="text-4xl font-bold text-white tracking-tight">Face Detection</h1>
        <p className="text-white/50 mt-2 text-sm font-light">Paste an image URL or upload an image from your device</p>
      </header>
      <ImageSearchForm
        onInputChange={onInputChange}
        onSubmit={onSubmit}
        inputValue={inputValue}
        onImageUpload={onImageUpload}
      />
      <Message message={message} isBusy={isBusy} />
      <ImageSelection
        setInputValue={setInputValue}
        onSubmit={onSubmit}
        inputValue={inputValue}
      />
      <FaceDetect
        imageURL={imageURL}
        boxes={boxes}
        onImageLoad={onImageLoad}
        onImageError={onImageError}
      />
    </div>
  );
}

export default App;
