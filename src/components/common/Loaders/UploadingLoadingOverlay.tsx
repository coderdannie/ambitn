interface Props {
  uploadProgress: number | undefined;
}

const LoadingOverlay = ({ uploadProgress }: Props) => (
  <div className="absolute inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center rounded-lg z-20">
    <div className=" rounded-lg p-6 min-w-[200px] text-center">
      <div className="mb-4">
        <div className="w-16 h-16 mx-auto mb-3">
          <svg
            className="w-16 h-16 animate-spin text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <div className="text-sm font-medium text-gray-100 mb-2">
          Uploading...
        </div>
        <div className="w-full rounded-full h-2 mb-2">
          <div
            className="bg-gray-100 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
        <div className="text-xs text-white">{uploadProgress}% complete</div>
      </div>
    </div>
  </div>
);

export default LoadingOverlay;
