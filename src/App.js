import { useEffect, useState } from 'react';
import ImageSearchForm from "./Components/ImageSearchForm";
import FaceDetect from "./Components/FaceDetect";
import ImageSelection from './Components/ImageSelection';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [box, setBox] = useState({});

  useEffect(() => {
    // console.log('Current input value:', inputValue);
  }, [inputValue])

  const onInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const onSubmit = (value) => {
      setBox({})
      setImageURL(value);

      if(value) {
        fetch(`/api/clarifai?image_url=${value}`)
        .then(response => response.json())
        .then(data => calculateFaceLocation(data))
        .catch(error => console.error('Error:', error));
      } else {
        alert("Please insert the URL of an image");
      }
  };

  const onImageUpload = (file) => {
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        alert("Please upload an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = e.target.result;
        const base64 = dataURL.split(',')[1];
        setBox({});
        setImageURL(dataURL);
        fetch('/api/clarifai/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_base64: base64 })
        })
        .then(response => response.json())
        .then(data => calculateFaceLocation(data))
        .catch(error => console.error('Error:', error));
      };
      reader.readAsDataURL(file);
  };

  const calculateFaceLocation = (data) => {
    if (!data?.outputs?.[0]?.data?.regions?.[0]?.region_info?.bounding_box) {
      alert("Unable to perform face detection at this time. Please try again later.");
      return;
    }
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    setBox({
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    });
  }

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
      <ImageSelection
        setInputValue={setInputValue}
        onSubmit={onSubmit}
        inputValue={inputValue}
      />
      <FaceDetect
        imageURL={imageURL}
        box={box}
      />
    </div>
  );
}

export default App;
