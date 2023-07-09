import React from 'react'

const FaceDetect = ({ imageURL, box }) => {
  return (
    <div className="flex justify-center">
      <div className="absolute mt-4">
        <img id="inputimage" alt="" src={imageURL} width="500px" heigh="auto" />
        <div
          className="bounding-box"
          style={{
            top: box.topRow,
            right: box.rightCol,
            bottom: box.bottomRow,
            left: box.leftCol,
          }}
        ></div>
      </div>
    </div>
  );
}

export default FaceDetect;
