import { useRef } from 'react';

const ImageSearchForm = ({ onInputChange, onSubmit, inputValue, onImageUpload }) => {
    const fileInputRef = useRef(null);

    return (
      <div className="mx-4 mt-6 mb-4">
        <div className="flex justify-center">
          <div className="glass flex flex-wrap items-center gap-3 p-3 rounded-2xl w-full max-w-xl">
            <div className="flex flex-1 min-w-[200px] items-center gap-2">
              <input
                  className="flex-1 min-w-0 bg-transparent text-white placeholder-white/40 text-sm outline-none px-3 py-2"
                  type="text"
                  onChange={onInputChange}
                  value={inputValue}
                  placeholder="Image URL here..."
                  onKeyDown={(e) => e.key === 'Enter' && onSubmit(inputValue)}
              />
              <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onImageUpload(e.target.files[0])}
              />
              <button
                  className="shrink-0 px-3 py-2 rounded-xl text-sm font-semibold text-white/70 hover:text-white glass hover:bg-white/10 transition-all duration-200"
                  onClick={() => fileInputRef.current.click()}
                  title="Upload from device"
              >
                Upload
              </button>
            </div>
            <button
                className="w-full sm:w-auto shrink-0 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 transition-all duration-200 hover:scale-105 active:scale-95"
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
