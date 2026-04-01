const ImageSearchForm = ({ onInputChange, onSubmit, inputValue }) => {
    return (
      <div className="mx-4 mt-6 mb-4">
        <div className="flex justify-center">
          <div className="glass flex items-center gap-3 p-3 rounded-2xl w-full max-w-xl">
            <input
                className="flex-1 bg-transparent text-white placeholder-white/40 text-sm outline-none px-3 py-2"
                type="text"
                onChange={onInputChange}
                value={inputValue}
                placeholder="Paste an image URL..."
                onKeyDown={(e) => e.key === 'Enter' && onSubmit(inputValue)}
            />
            <button
                className="shrink-0 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 transition-all duration-200 hover:scale-105 active:scale-95"
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
