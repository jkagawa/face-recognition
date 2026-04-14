import React from 'react'

const FaceDetect = ({ imageURL, box }) => {
  return (
    <div className="flex justify-center">
      <div className="relative mt-4 mb-4 inline-block">
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
