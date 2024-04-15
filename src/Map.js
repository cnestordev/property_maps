import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import useEmblaCarousel from 'embla-carousel-react';
import React, { useEffect, useMemo, useState } from 'react';

import PropertyForm from './PropertyForm';
import { PropertyList } from './PropertyList';
import { IoMdAddCircleOutline } from "react-icons/io";
import { CgDarkMode } from "react-icons/cg";
import { TbGps } from "react-icons/tb";
import GMaps from "./images/google_maps.png";
import GPS from "./images/gsp.png";
import BlueMarker from "./images/marker_blue.png";
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
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#203c44"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#2b4b4e"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#1b1f2f"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#2a5e64"
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
    
        const promiseOne = fetch(process.env.REACT_APP_JSON_URL, { headers });
        const promiseTwo = fetch(process.env.REACT_APP_JSON_COORDS, { headers });
    
        const [responseOne, responseTwo] = await Promise.all([promiseOne, promiseTwo]);
        const dataOne = await responseOne.json();
        const dataTwo = await responseTwo.json();
    
        setPosition(dataOne.record);
        setCities(dataTwo.record)
    };
    

    useEffect(() => {
        getData();
        fetchCurrentLocation();
    }, []);

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

    const filteredPositions = useMemo(() => {
        return position ? position.filter(pos => {
            return selectedCities.length === 0 || selectedCities.includes(pos.location.city);
        }) : [];
    }, [position, selectedCities]);
    
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
                                {
                                    cities.length > 0 ? (
                                        cities.map((city, index) => (
                                            <span key={index} onClick={() => toggleCitySelection(city)}
                                                className={`city-tag ${selectedCities.includes(city.city) ? 'selected' : ''}`}>
                                                {city.city}
                                            </span>
                                        ))
                                    ) : (
                                        <span>No cities found</span>
                                    )
                                }
                            </div>
                            <div className='nav-icon-container'>
                                <button className='center-location-button' onClick={() => setShowForm(!showForm)}><IoMdAddCircleOutline className='nav-icon-svg' /></button>
                                <button className='center-location-button' onClick={handleCenterLocation}><TbGps className='nav-icon-svg' /></button>
                                <CgDarkMode onClick={() => setIsDarkMode(!isDarkMode)} className='nav-icon-svg' />
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
                            coordinateData={cities}
                            googleApiKey={googleApiKey}
                            setCities={setCities}
                        />
                    )
                }
            </LoadScript >
        </div >
    );
}

export default React.memo(Map);
