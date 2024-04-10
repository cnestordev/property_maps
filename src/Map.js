import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';

import Crosshair from "./images/crosshair.png";
import GMaps from "./images/google_maps.png";
import GPS from "./images/gsp.png";
import BlueMarker from "./images/marker_blue.png";
import RedMarker from "./images/marker_red.png";
import PropertyForm from './PropertyForm';
import Add from "./images/add.png";

const containerStyle = {
    width: '100%',
    minHeight: '59.8vh',
    borderRadius: '10px'
};

function Map() {
    const [position, setPosition] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [selectedCities, setSelectedCities] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [cities, setCities] = useState([]);
    const [center, setCenter] = useState({
        lat: 33.20384585565068,
        lng: -96.72912847616412
    });
    const [zoom, setZoom] = useState(10);
    const [showForm, setShowForm] = useState(false);


    const toggleCitySelection = (city) => {
        setSelectedCities(prevSelectedCities => {
            if (prevSelectedCities.includes(city.city)) {
                // If the city is already selected, remove it from the array
                return prevSelectedCities.filter(selectedCity => selectedCity !== city.city);
            } else {
                // If the city is not selected, add it to the array
                return [...prevSelectedCities, city.city];
            }
        });
    };

    const getData = async () => {
        const res = await fetch(process.env.REACT_APP_JSON_URL);
        const data = await res.json();
        setPosition(data);
    };

    useEffect(() => {
        getData();
        fetchCurrentLocation();
    }, []);

    useEffect(() => {
        if (position) {
            console.log("%c position has changed!", "color: red");
            const uniqueCities = async (locations) => {
                console.log(locations)
                const result = [];
                const seenCities = new Set();

                for (const { location: { city, state } } of locations) {
                    console.log(city, state)
                    if (!seenCities.has(city)) {
                        let coords = await getCityCoordinates({ city, state });
                        seenCities.add(city);
                        result.push({ city, state, coords });
                    }
                }
                return result;
            };

            uniqueCities(position).then(uniqueLocations => {
                setCities(uniqueLocations);
            }).catch(error => {
                console.error("Failed to fetch unique locations:", error);
            });
        }
    }, [position]);

    useEffect(() => {
        // repeated code
        if (selectedCities.length === 1) {
            console.log(selectedCities);
            console.log(cities);
            const foundCity = cities.find(city => city.city === selectedCities[0]);
            if (foundCity) {
                setCenter(foundCity.coords);
                setZoom(11.5);
            }
        } else {
            setCenter({
                lat: 33.20384585565068,
                lng: -96.72912847616412
            });
            setZoom(10);
        }
    }, [selectedCities]);

    const fetchCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                setCurrentLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            }, (error) => {
                console.error("Error Code = " + error.code + " - " + error.message);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };


    const handleOpen = (path) => {
        window.open(path, '_blank');
    };

    const filteredPositions = position ? position.filter(pos => {
        const isCitySelected = selectedCities.length === 0 || selectedCities.includes(pos.location.city);
        return isCitySelected;
    }) : [];

    const getCityCoordinates = async ({ city, state }) => {
        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        const address = encodeURIComponent(`${city}, ${state}`);
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`);

        if (!response.ok) {
            throw new Error('Failed to geocode address');
        }

        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            console.log(location);
            return location;
        }

        throw new Error('No results found for the specified address');
    };

    const handleCenterLocation = () => {
        setZoom(17);
        setCenter(currentLocation);
    };

    const handleSelectedMarker = (marker) => {
        console.log(marker);
        const centerCoords = { lat: marker.location.lat, lng: marker.location.lng };
        setCenter(centerCoords);
        setZoom(12.5);
        setSelectedMarker(marker);
    };

    const handleUnselectedMarker = () => {
        setSelectedMarker(null);
        // repeated code
        if (selectedCities.length === 1) {
            console.log(selectedCities);
            console.log(cities);
            const foundCity = cities.find(city => city.city === selectedCities[0]);
            if (foundCity) {
                setCenter(foundCity.coords);
                setZoom(11.5);
            }
        } else {
            setCenter({
                lat: 33.20384585565068,
                lng: -96.72912847616412
            });
            setZoom(10);
        }

    };

    const handleMaps = (address) => {
        console.log(address);
        const formattedAddress = address.replace(/,/g, '');
        const googleMapsQuery = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formattedAddress)}`;
        window.open(googleMapsQuery, '_blank');
    };



    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '20px' }}>
            <LoadScript libraries={['places']} googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                <div className='filters-container'>
                    <div className='city-tags-container'>
                        {cities.map((city, index) => (
                            <span key={index} onClick={() => toggleCitySelection(city)}
                                className={`city-tag ${selectedCities.includes(city.city) ? 'selected' : ''}`}>
                                {city.city}
                            </span>
                        ))}
                    </div>
                    <div className='tools-container'>
                        <button className='center-location-button' onClick={handleCenterLocation}><img className='crosshair' src={Crosshair} /> Current Location</button>
                        <button onClick={() => setShowForm(!showForm)} className='add-property-button'><img className='add-property' src={Add} /></button>
                    </div>
                </div>

                <div className='dashboard-container'>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={zoom}
                        api_options={["MCYJ5E517XR2JC"]}
                        onClick={handleUnselectedMarker}
                    >
                        currentLocation && (
                        <Marker
                            position={currentLocation}
                            key={Math.floor(Math.random() * 9999999)}
                            icon={{
                                url: GPS,
                                scaledSize: { width: 35, height: 35 },
                            }}
                        />
                        )
                        {filteredPositions.map((pos, index) => (
                            <Marker
                                onClick={() => handleSelectedMarker(pos)}
                                key={index}
                                position={pos.location}
                                icon={{
                                    url: selectedMarker?.id === pos.id ? BlueMarker : RedMarker,
                                    scaledSize: { width: 35, height: 35 },
                                }}
                            />
                        ))}
                    </GoogleMap>
                    <div className={`${selectedMarker ? 'home-widget-selected' : ''} home-widget`}>
                        {
                            selectedMarker && (
                                <div>
                                    <h2 className='address-header'>{selectedMarker.location.address}</h2>
                                    <p className='price-subheader'>${parseInt(selectedMarker.price, 10).toLocaleString()}</p>
                                    <div onClick={() => handleOpen(selectedMarker.listingUrl)} style={{ cursor: 'pointer' }}>
                                        <img style={{ width: '100%' }} src={selectedMarker.imageUrl} alt="Property" />
                                    </div>
                                    <div className='action-buttons'>
                                        <button className='view-on-google' onClick={() => handleMaps(selectedMarker.location.address)}>
                                            <img className='gmaps-logo' src={GMaps} />
                                            View on Google Maps
                                        </button>
                                        <button onClick={() => handleUnselectedMarker()}>Add Notes</button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
                {
                    showForm && (
                        <PropertyForm
                            handleUnselectedMarker={handleUnselectedMarker}
                            propertyData={position}
                            setShowForm={setShowForm}
                            isOpen={showForm}
                            handleCloseModal={setShowForm}
                        />
                    )
                }
            </LoadScript >
        </div >
    );
}

export default React.memo(Map);
