import { useState } from "react";
import ImageGallery from "./ImageGallery";
import { BiMessageRoundedAdd } from "react-icons/bi";
import Bed from "./images/bed.png";
import Bath from "./images/bath.png";
import Like from "./images/like.png";
import Heart from "./images/heart.png";

export const PropertyList = ({ selectedMarker, handleMaps, handleOpen, emblaRef, GMaps, propertyData, handleUpatePositions }) => {
    
    const [showNotepad, setShowNotepad] = useState(false);
    const [note, setNote] = useState('');

    const clonedSelectedMarker = selectedMarker ? { ...selectedMarker } : null;

    if (!clonedSelectedMarker) {
        return null;
    }

    const handleAddNote = async () => {
        if (note) {
            const jsonBlobUrl = process.env.REACT_APP_JSON_URL;

            try {
                const index = propertyData.findIndex(property => property.id === clonedSelectedMarker.id);

                if (index !== -1) {
                    // Clone the array to avoid mutating the original data
                    let dataToSubmit = [...propertyData];

                    // Update the notes of the selected marker directly
                    dataToSubmit[index] = {
                        ...dataToSubmit[index],
                        notes: [...dataToSubmit[index].notes, {
                            note,
                            id: Date.now()
                        }]
                    };

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
                        clonedSelectedMarker.notes.push({
                            note
                        });
                        handleUpatePositions(data.record);
                    } else {
                        console.error('Failed to submit listing to jsonblob');
                    }
                } else {
                    console.log(`An entry with id ${clonedSelectedMarker.id} does not exist.`);
                }
            } catch (error) {
                console.error('Error submitting form to jsonblob:', error);
            }
            setNote('');
            setShowNotepad(false);
        }
    };

    const handleToggleFavorite = async () => {
        const jsonBlobUrl = process.env.REACT_APP_JSON_URL;

        try {
            const index = propertyData.findIndex(property => property.id === clonedSelectedMarker.id);

            if (index !== -1) {

                let dataToSubmit = [...propertyData];

                // Invert the isFavorited property of the selected marker directly
                dataToSubmit[index] = {
                    ...dataToSubmit[index],
                    isFavorited: !dataToSubmit[index].isFavorited
                };

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
                    console.log('Favorite status updated successfully to jsonblob');

                    const data = await response.json();
                    handleUpatePositions(data.record);
                } else {
                    console.error('Failed to update favorite status to jsonblob');
                }
            } else {
                console.log(`An entry with id ${clonedSelectedMarker.id} does not exist.`);
            }
        } catch (error) {
            console.error('Error while toggling favorite status:', error);
        }
    };



    return (
        <>
            <div className='property-details'>
                <div className="address-container">
                    <p className='address'>{clonedSelectedMarker.name}</p>
                    <p className='city-state-zip'>{clonedSelectedMarker.location.city}, {clonedSelectedMarker.location.state} {clonedSelectedMarker.location.zip}</p>
                    <p className='price-subheader'>${parseInt(clonedSelectedMarker.price, 10).toLocaleString()}</p>
                    <div className="property-size-container">
                        <span className="property-size"><img className="property-image" src={Bed} alt="Bed" /> {clonedSelectedMarker.beds}</span>
                        <span className="property-size"><img className="property-image" src={Bath} alt="Bath" /> {clonedSelectedMarker.baths}</span>
                    </div>
                </div>
                <div onClick={() => handleOpen(clonedSelectedMarker.listingUrl)} style={{ cursor: 'pointer' }}>
                    <div className="embla" ref={emblaRef}>
                        {
                            <ImageGallery imageUrls={clonedSelectedMarker.imageUrls} />
                        }
                    </div>
                </div>
                <div className="notes-container">
                    <h3 className="notes-header notes-context">Notes:</h3>
                    {
                        clonedSelectedMarker.notes.length > 0 && (
                            clonedSelectedMarker.notes.map((note, i) => <li className='notes-item' key={i}>{note.note}</li>)
                        )
                    }
                </div>
                <div className='action-buttons notes-context'>
                    <button className='view-on-google' onClick={() => handleMaps(clonedSelectedMarker.location.address)}>
                        {/* Ensure GMaps image source is correctly defined above this component or imported */}
                        <img className='gmaps-logo' src={GMaps} alt="Google Maps" />
                        View on Maps
                    </button>
                    <button className='add-notes-button' onClick={() => setShowNotepad(true)}><BiMessageRoundedAdd className="nav-icon-svg" />Add Notes</button>
                    <button onClick={handleToggleFavorite} className="like-button">
                        <img className="like-image" src={clonedSelectedMarker.isFavorited ? Heart : Like} alt="like" /> Favorite
                    </button>
                </div>
            </div>
            {
                showNotepad && (
                    <div className="notepad">
                        <textarea onClick={(e) => e.stopPropagation()} onChange={(e) => setNote(e.target.value)} placeholder="Add a note" />
                        <div className="action-buttons">
                            <button onClick={() => setShowNotepad(false)}>Cancel</button>
                            <button onClick={handleAddNote}>Add Note</button>
                        </div>
                    </div>
                )
            }
        </>

    );
};
