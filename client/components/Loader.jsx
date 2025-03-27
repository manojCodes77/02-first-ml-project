const Loader = () => {
    return (
        <div className="w-full max-w-4xl bg-white p-8 shadow-lg rounded-lg animate-reload-effect">
            <div className="w-full h-6 bg-gray-300 rounded mb-4"></div> 
            <div className="w-3/4 h-4 bg-gray-300 rounded mb-2"></div> 
            <div className="w-1/2 h-4 bg-gray-300 rounded mb-2"></div> 
            <div className="w-full h-4 bg-gray-300 rounded mb-2"></div> 
        </div>
    );
};

export default Loader;