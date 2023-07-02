import React from 'react'
import "./ImageSearchForm.css";

const ImageSearchForm = () => {
    return (
      <div className="m-14 to">
        <div className="mx-auto">
          <div className="form mx-auto p-8 rounded-lg shadow-2xl">
            <input className="f4 p-2 w-3/4 mx-auto" type="text" />
            <button className="w-1/4 text-xl link px-4 py-2 dib text-white bg-[#357EDD] hover:scale-110">
              Detect
            </button>
          </div>
        </div>
      </div>
    );
};

export default ImageSearchForm;