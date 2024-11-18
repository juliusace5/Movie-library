export default function SkeletonMovieCard() {
    return (
      <div className="bg-gray-700 p-4 rounded-lg animate-pulse shadow-md">
        <div className="w-full h-64 bg-gray-600 rounded mb-4"></div> {/* Placeholder for the image */}
        <div className="h-4 bg-gray-600 rounded w-3/4 mb-3"></div> {/* Placeholder for title */}
        <div className="h-3 bg-gray-600 rounded w-1/2 mb-2"></div> {/* Placeholder for release date */}
        <div className="h-3 bg-gray-600 rounded w-1/3"></div> {/* Placeholder for rating */}
      </div>
    );
  }
  