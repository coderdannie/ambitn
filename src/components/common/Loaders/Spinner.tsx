const CustomSpinner = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative w-12 h-12">
        {/* Outer dotted circle */}
        <div className="absolute inset-0 w-12 h-12 border-2 border-transparent rounded-full animate-spin">
          <div className="absolute top-0 left-1/2 w-2 h-2 -ml-1 -mt-1 bg-gray-400 rounded-full"></div>
          <div className="absolute top-1/2 right-0 w-2 h-2 -mr-1 -mt-1 bg-gray-400 rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 w-2 h-2 -ml-1 -mb-1 bg-gray-400 rounded-full"></div>
          <div className="absolute top-1/2 left-0 w-2 h-2 -ml-1 -mt-1 bg-gray-400 rounded-full"></div>
        </div>

        {/* Inner solid circle */}
        <div
          className="absolute inset-2 w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '1s' }}
        ></div>
      </div>
    </div>
  );
};
export default CustomSpinner;
