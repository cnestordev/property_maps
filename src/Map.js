import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import useEmblaCarousel from 'embla-carousel-react';
import React, { useEffect, useMemo, useState } from 'react';
import { IoMdAddCircleOutline } from "react-icons/io";
import { CgDarkMode } from "react-icons/cg";
import { TbGps } from "react-icons/tb";
import { CiCircleList } from "react-icons/ci";
import { useSnackbar } from 'react-simple-snackbar';

import PropertyForm from './PropertyForm';
import { PropertyList } from './PropertyList';
import { ListView } from './ListView';

import GMaps from "./images/google_maps.png";
import GPS from "./images/gsp.png";
import BlueMarker from "./images/marker_green.png";
import RedMarker from "./images/marker_pink.png";
import Heart from "./images/heart_alt1.png";

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
                "saturation": 10
            },
            {
                "lightness": 30
            },
            {
                "gamma": 0.5
            },
            {
                "hue": "#435158"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
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
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
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
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.attraction",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.school",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "simplified"
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
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.icon",
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
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.station.airport",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "simplified"
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
                "visibility": "off"
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

const options = {
    position: 'top-right',
    style: {
        backgroundColor: '#0d6ea1',
        border: '2px solid #0d6ea1',
        color: '#c1eaff',
        fontFamily: 'inherit',
        fontSize: '20px',
        textAlign: 'center',
        top: '10px',
    },
    closeStyle: {
        color: 'red',
        fontSize: '16px',
    },
};

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
    const [showListView, setShowListView] = useState(false);
    const [openSnackbar, closeSnackbar] = useSnackbar(options);


    const toggleDarkMode = () => {
        setIsDarkMode(prevIsDarkMode => !prevIsDarkMode);
        localStorage.setItem('darkmode', JSON.stringify(!isDarkMode));
    };

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
        try {
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
            setCities(dataTwo.record);
        } catch (error) {
            console.error('Error fetching data:', error);
            openSnackbar('There was an error fetching the data.', 5000);
        }
    };


    useEffect(() => {
        const savedSetting = localStorage.getItem('darkmode');
        if (savedSetting !== null) {
            setIsDarkMode(JSON.parse(savedSetting));
        }
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

    useEffect(() => {
        const updatedMarker = position.find(marker => marker.id === selectedMarker?.id);
        if (updatedMarker) {
            setSelectedMarker(updatedMarker);
        }
    }, [position]);

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

    const handleShowListView = () => {
        setShowListView(prevShowListView => !prevShowListView);
    };

    return (
        <div className={`parent-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <LoadScript libraries={libraries} googleMapsApiKey={googleApiKey}>
                <div className='dashboard-container'>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={zoom}
                        onClick={handleUnselectedMarker}
                        options={{
                            styles: isDarkMode ? darkModeStyle : lightModeStyle,
                            streetViewControl: false,
                            fullscreenControl: false
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
                                <button className='center-location-button' onClick={handleShowListView}><CiCircleList className='nav-icon-svg' /></button>
                                <button className='center-location-button' onClick={handleCenterLocation}><TbGps className='nav-icon-svg' /></button>
                                <button className='center-location-button' onClick={() => setShowForm(!showForm)}><IoMdAddCircleOutline className='nav-icon-svg' /></button>
                                <button className='center-location-button' onClick={toggleDarkMode}><CgDarkMode className='nav-icon-svg' /></button>
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
                                    url: pos.isFavorited ? Heart : selectedMarker?.id === pos.id ? RedMarker : BlueMarker,
                                    scaledSize: pos.isFavorited ? { width: 45, height: 45 } : { width: 50, height: 50 },
                                }}
                            />
                        ))}
                    </GoogleMap>
                    <div className={`list-view-widget ${!showListView ? 'hidden' : ''}`}>
                        <ListView
                            selectedMarker={selectedMarker}
                            properties={filteredPositions}
                            handleSelectedMarker={handleSelectedMarker}
                        />
                    </div>
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
                            openSnackbar={openSnackbar}
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
                            openSnackbar={openSnackbar}
                        />
                    )
                }
            </LoadScript >
        </div >
    );
}

export default React.memo(Map);
