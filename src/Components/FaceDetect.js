import React from 'react'

const FaceDetect = ({ imageURL, boxes, onImageLoad, onImageError }) => {
  if (!imageURL) return null;

  return (
    <div className="flex justify-center">
      <div className="relative mt-4 mb-4 inline-block">
        <img
          id="inputimage"
          alt=""
          src={imageURL}
          width="500px"
          height="auto"
          // Without this the canvas is tainted and face-api.js can't read pixels.
          crossOrigin="anonymous"
          onLoad={(e) => onImageLoad(e.target)}
          onError={onImageError}
        />
        {boxes.map((box, index) => (
          <div
            key={index}
            className="bounding-box"
            style={{
              top: box.topRow,
              right: box.rightCol,
              bottom: box.bottomRow,
              left: box.leftCol,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default FaceDetect;
