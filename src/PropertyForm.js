import React, { useState } from 'react';
import AddressAutocomplete from './AddressAutocomplete';
import { ThreeDots } from 'react-loader-spinner';

function PropertyForm({ propertyData, handleCloseModal, isOpen }) {
    console.log(propertyData);
    const [formData, setFormData] = useState({
        name: '',
        listingUrl: '',
        beds: '',
        baths: '',
        price: '',
        imageUrl: '',
        location: {
            lat: 0,
            lng: 0,
            address: '',
            city: '',
            state: ''
        },
        id: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setIsLoading(true);

        const jsonBlobUrl = 'https://jsonblob.com/api/jsonBlob/1227039048840634368';

        try {
            const response = await fetch(jsonBlobUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify([...propertyData, formData])
            });

            if (response.ok) {
                console.log('Listing submitted successfully to jsonblob');
            } else {
                console.error('Failed to submit listing to jsonblob');
            }
        } catch (error) {
            console.error('Error submitting form to jsonblob:', error);
        }
        setIsLoading(false)
        handleClickOverlay();
    };

    const onPlaceSelected = (place) => {
        const locationUpdate = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address,
            city: place.address_components[2].long_name,
            state: place.address_components[4].short_name,
            id: place.place_id
        };

        setFormData(prevState => ({
            ...prevState,
            location: {
                ...prevState.location,
                ...locationUpdate
            }
        }));
    };

    const handleClickOverlay = () => {
        if (isOpen) {
            handleCloseModal();
        }
    };


    return (
        <div onSubmit={handleSubmit} className='property-form-container'>
            <form className='property-form'>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <AddressAutocomplete onPlaceSelected={onPlaceSelected} />
                <input
                    type="url"
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
                    type="text"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                />
                <input
                    type="url"
                    name="imageUrl"
                    placeholder="Image URL"
                    value={formData.imageUrl}
                    onChange={handleChange}
                />
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