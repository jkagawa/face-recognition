import { useEffect, useState } from 'react';
import ImageSearchForm from "./Components/ImageSearchForm";
import FaceDetect from "./Components/FaceDetect";
import ImageSelection from './Components/ImageSelection';
// import Clarifai from "clarifai";

function App() {
  const [inputValue, setInputValue] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [box, setBox] = useState({});

  useEffect(() => {
    // console.log('Current input value:', inputValue);
  }, [inputValue])

  // set state for our input
  const onInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Perform a function when submitting with onSubmit
  const onSubmit = (value) => {
      // Clear box dimensions
      setBox({})
      // set imageUrl state
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

  const calculateFaceLocation = (data) => {
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
    <div className="App">
        <ImageSearchForm
          onInputChange={onInputChange}
          onSubmit={onSubmit}
          inputValue={inputValue}
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
