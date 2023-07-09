import React from 'react'

const ImageSearchForm = ({ onInputChange, onSubmit, inputValue }) => {

    return (
      <div className="mx-4 mt-14 mb-6 pt-8">
        <div className="flex justify-center">
          <div className="form flex justify-center p-6 rounded-lg shadow-2xl">
            <input 
                className="f4 p-2 w-2/3 md:w-3/4 flex justify-center" 
                type="text" 
                onChange={onInputChange}
                value={inputValue}
            />
            <button 
                className="w-1/3 md:w-1/4 text-xl link px-4 py-2 dib text-white bg-[#357EDD] hover:scale-110"
                onClick={() => onSubmit(inputValue)}
            >
              Detect
            </button>
          </div>
        </div>
      </div>
    );
}

export default ImageSearchForm;