import React from 'react'

export default function ImageSelection({ setInputValue, onSubmit }) {

    const images = {
        1: "https://images.unsplash.com/photo-1688619101864-1256eadb1740?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        2: "https://images.unsplash.com/photo-1596902852634-9dc8f029bb1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        3: "https://images.unsplash.com/photo-1501450626433-39bbf117090e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"

    }

    const selectImage = (value) => {
        setInputValue(value);
        onSubmit(value);
    }
  return (
    <div className="mx-4 my-4">
        <div className="flex justify-center">
          <div className="selection-area flex flex-col justify-center px-2 pb-6 rounded-lg shadow-2xl">
            <div className='text-white py-4'>Try one of the images below</div>
            <div className='flex flex-row'>
                {
                    Object.entries(images).map(([key, value]) => 
                        <div
                            className='w-1/3 cursor-pointer flex justify-center align-middle'
                            onClick={() => selectImage(value)}
                            key={key}
                        >
                            <img src={value} className='selection-img rounded-lg' alt=""/>
                        </div>
                    )
                }
            </div>
            
          </div>
        </div>
      </div>
  )
}
