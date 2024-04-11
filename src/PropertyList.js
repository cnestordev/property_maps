import ImageGallery from "./ImageGallery";

export const PropertyList = ({ selectedMarker, handleUnselectedMarker, handleMaps, handleOpen, emblaRef, GMaps }) => {
    
    if (!selectedMarker) {
        return null;
    }

    return (
        <div className='property-details'>
            <div className="address-container">
                <p className='address'>{selectedMarker.name}</p>
                <p className='city-state-zip'>{selectedMarker.location.city}, {selectedMarker.location.state} {selectedMarker.location.zip}</p>
            </div>
            <p className='price-subheader'>${parseInt(selectedMarker.price, 10).toLocaleString()}</p>
            <div onClick={() => handleOpen(selectedMarker.listingUrl)} style={{ cursor: 'pointer' }}>
                <div className="embla" ref={emblaRef}>
                    {
                        <ImageGallery imageUrls={selectedMarker.imageUrls} />
                    }
                </div>
            </div>
            <div className='action-buttons'>
                <button className='view-on-google' onClick={() => handleMaps(selectedMarker.location.address)}>
                    {/* Ensure GMaps image source is correctly defined above this component or imported */}
                    <img className='gmaps-logo' src={GMaps} alt="Google Maps" />
                    View on Google Maps
                </button>
                <button onClick={() => handleUnselectedMarker()}>Add Notes</button>
            </div>
        </div>
    );
};
