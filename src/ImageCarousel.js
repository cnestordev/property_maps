import React, { useState } from 'react';

const ImageCarousel = ({ images }) => {
    console.log(images)

    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        const isFirstImage = currentIndex === 0;
        const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastImage = currentIndex === images.length - 1;
        const newIndex = isLastImage ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div>
            <button onClick={goToPrevious}>{'<'}</button>
            <img src={`https://rentpath-res.cloudinary.com/${images[currentIndex].id}`} alt={`Slide ${currentIndex}`} />
            <button onClick={goToNext}>{'>'}</button>
        </div>
    );
};

export default ImageCarousel;
