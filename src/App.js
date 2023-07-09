import { useEffect, useState } from 'react';
import ImageSearchForm from "./Components/ImageSearchForm";
import FaceDetect from "./Components/FaceDetect";
// import Clarifai from "clarifai";

function App() {
  const [inputValue, setInputValue] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [box, setBox] = useState({});

  useEffect(() => {
    console.log(inputValue);
  }, [inputValue])

  // set state for our input
  const onInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Perform a function when submitting with onSubmit
  const onSubmit = () => {
      // set imageUrl state
      setImageURL(inputValue);

      
      const token = process.env.REACT_APP_TOKEN;
      const USER_ID = 'clarifai';
      const APP_ID = 'main';
      const MODEL_ID = 'face-detection';
      const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
      console.log(token);

      const raw = JSON.stringify({
        "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": imageURL
                    }
                }
            }
        ]
      });
      
      const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + token
        },
        body: raw
      };
 
      fetch(`https://api.clarifai.com/v2/models/`+MODEL_ID+`/versions/`+MODEL_VERSION_ID+`/outputs`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        console.log(result.outputs[0].data.regions[0].region_info.bounding_box);
        calculateFaceLocation(result);
      })
      .catch(error => console.log('error', error));
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
        />
        <FaceDetect 
          imageURL={imageURL}
          box={box}
        />
    </div>
  );
}

export default App;
