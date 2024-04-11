import React, { useState } from 'react';
import AddressAutocomplete from './AddressAutocomplete';
import { ThreeDots } from 'react-loader-spinner';

function PropertyForm({ propertyData, handleCloseModal, isOpen, handleUpatePositions }) {
    console.log(propertyData);
    const [formData, setFormData] = useState({
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
        name: ''
    });
    const [isLoading, setIsLoading] = useState(false);

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

        const jsonBlobUrl = process.env.REACT_APP_JSON_URL;

        try {
            const existingEntry = propertyData.find(property => property.id === formData.id);

            let dataToSubmit = propertyData;

            if (!existingEntry) {
                dataToSubmit = [...propertyData, formData];
            } else {
                return console.log(`An entry with id ${formData.id} already exists.`);
            }

            const response = await fetch(jsonBlobUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(dataToSubmit)
            });

            if (response.ok) {
                console.log('Listing submitted successfully to jsonblob');

                const data = await response.json();
                handleUpatePositions(data);

            } else {
                console.error('Failed to submit listing to jsonblob');
            }
        } catch (error) {
            console.error('Error submitting form to jsonblob:', error);
        }

        setIsLoading(false);
        handleClickOverlay();
    };

    const onPlaceSelected = (place) => {
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
                    type="text"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
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