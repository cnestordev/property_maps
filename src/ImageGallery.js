import { useState } from "react";

export const ImageGallery = ({ imageUrls }) => {

  const [loadingStates, setLoadingStates] = useState(imageUrls.map(() => true));


  const handleImageLoad = (index) => {
    setLoadingStates((prevLoadingStates) => 
      prevLoadingStates.map((isLoading, i) => (i === index ? false : isLoading))
    );
  };

  const allImagesLoaded = loadingStates.every((isLoading) => !isLoading);

  return (
    <div className="embla__container">
      {!allImagesLoaded && <div>Loading images...</div>}
      {imageUrls.map((url, index) => (
        <div className="embla__slide" key={index}>
          <img
            style={{ width: '100%', display: loadingStates[index] ? 'none' : 'block' }}
            src={url}
            alt={`Property ${index + 1}`}
            onLoad={() => handleImageLoad(index)}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
