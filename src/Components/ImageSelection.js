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
                <div className="glass flex flex-col items-center px-4 pb-5 pt-4 rounded-2xl w-full max-w-xl">
                    <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-4">Pick a sample image below</p>
                    <div className="flex flex-row gap-3 w-full">
                        {Object.entries(images).map(([key, value]) =>
                            <div
                                className="flex-1 cursor-pointer overflow-hidden rounded-xl"
                                onClick={() => selectImage(value)}
                                key={key}
                            >
                                <img src={value} className="selection-img w-full rounded-xl" alt="" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
