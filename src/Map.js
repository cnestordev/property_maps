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
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(Infinity);
    const [selectedCities, setSelectedCities] = useState([]);

    const toggleCitySelection = (city) => {
        setSelectedCities(prevSelectedCities => {
            if (prevSelectedCities.includes(city)) {
                // If the city is already selected, remove it from the array
                return prevSelectedCities.filter(selectedCity => selectedCity !== city);
            } else {
                // If the city is not selected, add it to the array
                return [...prevSelectedCities, city];
            }
        });
    };

    const cities = position ? Array.from(new Set(position.map(pos => pos.location.city))) : [];

    const getData = async () => {
        const res = await fetch(process.env.REACT_APP_JSON_URL);
        const data = await res.json();
        console.log(data);
        setPosition(data);
    };

    useEffect(() => {
        getData();
    }, []);

    const handleOpen = (path) => {
        const url = `https://rent.com/${path}`;
        window.open(url, '_blank');
    };

    // Filter positions based on price range
    const filteredPositions = position ? position.filter(pos => {
        const price = parseFloat(pos.priceText.replace(/[^0-9.-]+/g, ""));
        const isPriceInRange = price >= minPrice && price <= maxPrice;
        const isCitySelected = selectedCities.length === 0 || selectedCities.includes(pos.location.city);
        return isPriceInRange && isCitySelected;
    }) : [];

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '20px' }}>
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                <div>
                    <input placeholder='Min' type="text" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} />
                    <input type="text" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} />
                </div>
                <div className='city-tags-container'>
                    {cities.map((city, index) => (
                        <span key={index} onClick={() => toggleCitySelection(city)}
                            className={`city-tag ${selectedCities.includes(city) ? 'selected' : ''}`}>
                            {city}
                        </span>
                    ))}
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
                                <div onClick={() => handleOpen(selectedMarker.urlPathname)} style={{ cursor: 'pointer' }}>
                                    <img style={{ width: '100%' }} src={`https://rentpath-res.cloudinary.com/${selectedMarker.photos[0].id}`} alt="Property" />
                                </div>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript >
        </div >
    );
}

export default React.memo(Map);
