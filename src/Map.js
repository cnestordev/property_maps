import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import useEmblaCarousel from 'embla-carousel-react';
import React, { useEffect, useState } from 'react';

import PropertyForm from './PropertyForm';
import { PropertyList } from './PropertyList';
import Add from "./images/add.png";
import Contrast from "./images/contrast.png";
import Crosshair from "./images/crosshair.png";
import GMaps from "./images/google_maps.png";
import GPS from "./images/gsp.png";
import BlueMarker from "./images/marker_green.png";
import RedMarker from "./images/marker_red.png";

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '10px',
    position: 'relative'
};

const darkModeStyle = [
    {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
            {
                "invert_lightness": true
            },
            {
                "saturation": "-9"
            },
            {
                "lightness": "0"
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [
            {
                "weight": "1.00"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "weight": "0.49"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "weight": "0.01"
            },
            {
                "lightness": "-7"
            },
            {
                "saturation": "-35"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    }
];

const lightModeStyle = [
    {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
            {
                "saturation": "32"
            },
            {
                "lightness": "-3"
            },
            {
                "visibility": "on"
            },
            {
                "weight": "1.18"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [
            {
                "saturation": "-70"
            },
            {
                "lightness": "14"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "saturation": "100"
            },
            {
                "lightness": "-14"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": "12"
            }
        ]
    }
];


const centerLatLng = {
    lat: 33.20384585565068,
    lng: -96.72912847616412
};

const libraries = ["places"];

function Map({ googleApiKey }) {
    const [position, setPosition] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [selectedCities, setSelectedCities] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [cities, setCities] = useState([]);
    const [center, setCenter] = useState(centerLatLng);
    const [zoom, setZoom] = useState(10);
    const [showForm, setShowForm] = useState(false);
    const [emblaRef] = useEmblaCarousel();
    const [isDarkMode, setIsDarkMode] = useState(false);

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
        const headers = {
            'X-Master-Key': process.env.REACT_APP_JSON_MASTER_KEY,
            'Content-Type': 'application/json'
        };

        const response = await fetch(process.env.REACT_APP_JSON_URL, { headers });

        const data = await response.json();
        setPosition(data.record);
    };

    useEffect(() => {
        getData();
        fetchCurrentLocation();
    }, []);

    useEffect(() => {
        if (position) {
            const uniqueCities = async (locations) => {
                const result = [];
                const seenCities = new Set();

                for (const { location: { city, state } } of locations) {
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
            setCenter(centerLatLng);
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
        const address = encodeURIComponent(`${city}, ${state}`);
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleApiKey}`);

        if (!response.ok) {
            throw new Error('Failed to geocode address');
        }

        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const location = data.results[0].geometry.location;
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
        setZoom(16.5);
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

    const handleUpatePositions = (newPositions) => {
        setPosition(newPositions);
    };


    return (
        <div className='parent-container'>
            <LoadScript libraries={libraries} googleMapsApiKey={googleApiKey}>
                <div className='dashboard-container'>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={zoom}
                        onClick={handleUnselectedMarker}
                        options={{
                            styles: isDarkMode ? darkModeStyle : lightModeStyle
                        }}
                    >
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
                                <button className='center-location-button' onClick={handleCenterLocation}><img className='crosshair' src={Crosshair} /></button>
                                <button onClick={() => setShowForm(!showForm)} className='add-property-button'><img className='add-property' src={Add} /></button>
                            </div>
                            <div onClick={() => setIsDarkMode(!isDarkMode)} className='nav-icon-container'>
                                <img className='nav-icon' src={Contrast} />
                            </div>
                        </div>
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
                        <PropertyList
                            selectedMarker={selectedMarker}
                            handleUnselectedMarker={handleUnselectedMarker}
                            handleMaps={handleMaps}
                            handleOpen={handleOpen}
                            emblaRef={emblaRef}
                            GMaps={GMaps}
                            propertyData={position}
                            handleUpatePositions={handleUpatePositions}
                        />
                    </div>
                </div>
                {
                    showForm && (
                        <PropertyForm
                            handleUnselectedMarker={handleUnselectedMarker}
                            propertyData={position}
                            isOpen={showForm}
                            handleCloseModal={setShowForm}
                            handleUpatePositions={handleUpatePositions}
                        />
                    )
                }
            </LoadScript >
        </div >
    );
}

export default React.memo(Map);
