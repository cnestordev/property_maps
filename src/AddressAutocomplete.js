import React, { useState, useEffect, useRef } from 'react';

function AddressAutocomplete({ onPlaceSelected }) {
    const [inputValue, setInputValue] = useState('');
    const autocompleteInputRef = useRef(null);

    useEffect(() => {
        const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInputRef.current, {
            types: ['address'], 
            componentRestrictions: { country: 'us' },
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            console.log(place)
            if (place) {
                onPlaceSelected(place);
                setInputValue(place.formatted_address || '');
            }
        });

        return () => {
            window.google.maps.event.clearInstanceListeners(autocomplete);
        };
    }, [onPlaceSelected]);

    return (
        <input
            ref={autocompleteInputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter an address"
            type="text"
        />
    );
}

export default AddressAutocomplete;
