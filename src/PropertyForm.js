import React, { useEffect, useState } from 'react';
import AddressAutocomplete from './AddressAutocomplete';
import { ThreeDots } from 'react-loader-spinner';

function PropertyForm({ propertyData, handleCloseModal, isOpen, handleUpatePositions, coordinateData, googleApiKey, setCities }) {
    console.log(propertyData);
    const [formData, setFormData] = useState({
        listingUrl: '',
        beds: '',
        baths: '',
        price: '',
        imageUrls: [],
        location: {
            lat: 0,
            lng: 0,
            address: '',
            city: '',
            state: ''
        },
        id: '',
        name: '',
        notes: [],
        isFavorited: false,
        historicalPrices: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [currentNote, setCurrentNote] = useState('');

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


    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value
            };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setIsLoading(true);
        console.log(formData);
        const jsonBlobUrl = process.env.REACT_APP_JSON_URL;

        try {
            const existingEntry = propertyData.find(property => property.id === formData.id);

            let dataToSubmit = propertyData;

            let date = new Date();
            let formattedDate = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });


            if (!existingEntry) {
                if (currentNote) {
                    formData.notes.push({
                        note: currentNote,
                        id: Date.now()
                    });
                }
                formData.historicalPrices.push({
                    price: formData.price,
                    date: formattedDate
                });
                dataToSubmit = [...propertyData, formData];
            } else {
                return console.log(`An entry with id ${formData.id} already exists.`);
            }
            const response = await fetch(jsonBlobUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Master-Key': process.env.REACT_APP_JSON_MASTER_KEY
                },
                body: JSON.stringify(dataToSubmit)
            });

            if (response.ok) {
                console.log('Listing submitted successfully to jsonblob');

                const data = await response.json();

                const city = formData.location.city;
                const state = formData.location.state;

                const cityExists = coordinateData.some(entry => entry.city.toLowerCase() === city.toLowerCase());
                if (!cityExists) {
                    const coords = await getCityCoordinates({ city, state });
                    const newData = { city, state, coords };
                    const newCoordinateData = [...coordinateData, newData];

                    // Update the JSON blob with the new data
                    const headers = {
                        'Content-Type': 'application/json',
                        'X-Master-Key': process.env.REACT_APP_JSON_MASTER_KEY,
                    };
                    const coordResponse = await fetch(process.env.REACT_APP_JSON_COORDS, {
                        method: 'PUT',
                        headers: headers,
                        body: JSON.stringify(newCoordinateData)
                    });
                    const coordData = await coordResponse.json();
                    setCities(coordData.record);

                } else {
                    console.log("City already exists:", city);
                }

                handleUpatePositions(data.record);

            } else {
                console.error('Failed to submit listing to jsonblob');
            }

        } catch (error) {
            console.error('Error submitting form to jsonblob:', error);
        }

        setIsLoading(false);
        handleClickOverlay();
    };

    const onPlaceSelected = async (place) => {
        console.log(place);
        let city = '';
        let state = '';


        place.address_components.forEach(component => {
            if (component.types.includes('locality')) {
                city = component.long_name;
            } else if (component.types.includes('administrative_area_level_1')) {
                state = component.short_name;
            }
        });


        const locationUpdate = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address,
            city,
            state
        };

        setFormData(prevState => ({
            ...prevState,
            location: {
                ...prevState.location,
                ...locationUpdate
            },
            id: place.place_id,
            name: place.name
        }));
    };

    const handleClickOverlay = () => {
        if (isOpen) {
            handleCloseModal();
        }
    };

    async function readClipboard() {
        try {
            if (navigator.clipboard) {
                const text = await navigator.clipboard.readText();

                const imageUrlRegex = /\bhttps?:\/\/\S*(?:png|jpe?g|webp|cloudinary)\b/i;

                const isImageUrl = imageUrlRegex.test(text);

                if (isImageUrl) {
                    setFormData(prevState => ({
                        ...prevState,
                        imageUrls: [...prevState.imageUrls, text]
                    }));
                } else {
                    console.log('Clipboard content is not a valid image URL');
                }
            } else {
                console.log('Clipboard API not available');
            }
        } catch (err) {
            console.error('Failed to read from the clipboard', err);
        }
    }

    return (
        <div onSubmit={handleSubmit} className='property-form-container'>
            <form className='property-form'>
                <AddressAutocomplete onPlaceSelected={onPlaceSelected} />
                <input
                    type="text"
                    name="listingUrl"
                    placeholder="Listing URL"
                    value={formData.listingUrl}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="beds"
                    placeholder="Beds"
                    value={formData.beds}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="baths"
                    placeholder="Baths"
                    value={formData.baths}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                />
                <textarea
                    name="notes"
                    placeholder="Notes"
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                />
                {
                    formData.imageUrls.length > 0 && (
                        <div className='image-display-container'>
                            {formData.imageUrls.map((imageUrl, index) => (
                                <img className='image-display' key={index} src={imageUrl} alt={`Image ${index + 1}`} />
                            ))}
                        </div>
                    )
                }
                <div onClick={readClipboard} className='image-input-container'>
                    <span>Tap to add images</span>
                </div>
                <button className='submit-button' type="submit">
                    {
                        isLoading
                            ? <ThreeDots
                                height="30"
                                width="30"
                                radius="9"
                                color="#ffffff"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                visible={true}
                            />
                            : 'Submit'
                    }
                </button>
                <button onClick={(e) => handleClickOverlay()} type="text">Cancel</button>
            </form>
        </div>
    );
}

export default PropertyForm;