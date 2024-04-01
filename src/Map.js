import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';

const containerStyle = {
    width: '95%',
    height: '75vh',
    borderRadius: '10px'
};

const center = {
    lat: 33.20384585565068,
    lng: -96.72912847616412
};

function Map() {
    const [position, setPosition] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [minPrice, setMinPrice] = useState(0); // Minimum price state
    const [maxPrice, setMaxPrice] = useState(Infinity); // Maximum price state

    const getData = async () => {
        const res = await fetch(process.env.REACT_APP_JSON_URL);
        const data = await res.json();
        setPosition(data);
    };

    useEffect(() => {
        getData();
    }, []);

    const handleOpen = (path) => {
        console.log(path)
        const url = `https://rent.com/${path}`;
        window.open(url, '_blank');
    };

    // Filter positions based on price range
    const filteredPositions = position ? position.filter(pos => {
        const price = parseFloat(pos.priceText.replace(/[^0-9.-]+/g, "")); // Extracting numerical value from priceText
        return price >= minPrice && price <= maxPrice;
    }) : [];

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                <div>
                    <label>Min Price:</label>
                    <input type="number" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} />
                    <label>Max Price:</label>
                    <input type="number" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} />
                </div>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                >
                    {filteredPositions.map((pos, index) => (
                        <Marker
                            onClick={() => setSelectedMarker(pos)}
                            key={index}
                            position={pos.location} />
                    ))}
                    {selectedMarker && (
                        <InfoWindow
                            position={selectedMarker.location}
                            onCloseClick={() => setSelectedMarker(null)}
                        >
                            <div>
                                <h2>{selectedMarker.addressFull}</h2>
                                <p>{selectedMarker.priceText}</p>
                                <a target="_blank" rel="noopener noreferrer" href={`https://rent.com${selectedMarker.urlPathname}`}>View</a>
                                <div onClick={() => handleOpen(selectedMarker.urlPathname)} style={{ cursor: 'pointer' }}>
                                    <img style={{ width: '50%' }} src={`https://rentpath-res.cloudinary.com/${selectedMarker.photos[0].id}`} alt="Property" />
                                </div>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}

export default React.memo(Map);
