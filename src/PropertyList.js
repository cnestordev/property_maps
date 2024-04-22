import { useState } from "react";

import { BiMessageRoundedAdd } from "react-icons/bi";
import { Image } from "./Image";
import { Chart } from "./Chart";
import ImageGallery from "./ImageGallery";
import Bath from "./images/bath.png";
import Bed from "./images/bed.png";
import Heart from "./images/heart.png";
import Like from "./images/like.png";
import Calendar from "./images/calendar.png";
import { LuTrash } from "react-icons/lu";
import Money from "./images/money.png";
import Apartment from "./images/apartment.png";



export const PropertyList = ({ selectedMarker, handleMaps, handleOpen, emblaRef, GMaps, propertyData, handleUpatePositions, openSnackbar }) => {

    const [showNotepad, setShowNotepad] = useState(false);
    const [note, setNote] = useState('');
    const [price, setPrice] = useState(0);
    const [tourDate, setTourDate] = useState('');
    const [tourTime, setTourTime] = useState('');
    const [hasTour, setHasTour] = useState(false);

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
                        openSnackbar('Note added successfully.', 3000);
                        handleUpatePositions(data.record);
                    } else {
                        console.error('Failed to submit listing to jsonblob');
                    }
                } else {
                    openSnackbar('An entry with id ' + clonedSelectedMarker.id + ' does not exist.', 3000);
                    console.log(`An entry with id ${clonedSelectedMarker.id} does not exist.`);
                }
            } catch (error) {
                openSnackbar('Error submitting note.', 3000);
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
                    openSnackbar('Favorite updated successfully.', 3000);
                    handleUpatePositions(data.record);
                } else {
                    openSnackbar('Error updating favorite status.', 3000);
                    console.error('Failed to update favorite status to jsonblob');
                }
            } else {
                openSnackbar('An entry with id ' + clonedSelectedMarker.id + ' does not exist.', 3000);
                console.log(`An entry with id ${clonedSelectedMarker.id} does not exist.`);
            }
        } catch (error) {
            openSnackbar('Error while toggling favorite status.', 3000);
            console.error('Error while toggling favorite status:', error);
        }
    };

    const handleAddPrice = async () => {
        if (price) {
            const jsonBlobUrl = process.env.REACT_APP_JSON_URL;

            const currentDate = new Date();
            const formattedDate = ((currentDate.getMonth() + 1) + '').padStart(2, '0') + '/' + (currentDate.getDate() + '').padStart(2, '0');

            try {
                const index = propertyData.findIndex(property => property.id === clonedSelectedMarker.id);

                if (index !== -1) {
                    let dataToSubmit = [...propertyData];

                    dataToSubmit[index] = {
                        ...dataToSubmit[index],
                        price,
                        historicalPrices: [...dataToSubmit[index].historicalPrices, {
                            price,
                            date: formattedDate
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
                        console.log('Historical data submitted successfully to jsonblob');

                        const data = await response.json();
                        handleUpatePositions(data.record);
                        openSnackbar('Price updated successfully.', 3000);
                    } else {
                        openSnackbar('Error updating price.', 3000);
                        console.error('Failed to submit historical data to jsonblob');
                    }
                } else {
                    openSnackbar('An entry with id ' + clonedSelectedMarker.id + ' does not exist.', 3000);
                    console.log(`An entry with id ${clonedSelectedMarker.id} does not exist.`);
                }
            } catch (error) {
                openSnackbar('Error submitting price.', 3000);
                console.error('Error submitting historical data to jsonblob:', error);
            }
        }
        setShowNotepad(false);
        setPrice(0);
    };

    const handleToggleHideProperty = async () => {
        const jsonBlobUrl = process.env.REACT_APP_JSON_URL;

        try {
            const index = propertyData.findIndex(property => property.id === clonedSelectedMarker.id);

            if (index !== -1) {
                // Toggle the isHidden property instead of deleting the item
                propertyData[index].isHidden = true;

                const response = await fetch(jsonBlobUrl, {
                    method: 'PUT', // Use PUT to update the entire collection
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Master-Key': process.env.REACT_APP_JSON_MASTER_KEY
                    },
                    body: JSON.stringify(propertyData)
                });

                if (response.ok) {
                    console.log('Property visibility toggled successfully in jsonblob');

                    const data = await response.json();
                    handleUpatePositions(data.record); // Assuming you might still need to update positions
                    openSnackbar('Property hidden successfully.', 3000);
                } else {
                    console.error('Failed to hide property in jsonblob');
                    openSnackbar('Failed to hide property.', 3000);
                }
            } else {
                openSnackbar('Property with id ' + clonedSelectedMarker.id + ' does not exist.', 3000);
                console.log(`Property with id ${clonedSelectedMarker.id} does not exist.`);
            }
        } catch (error) {
            openSnackbar('Error while toggling property visibility.', 3000);
            console.error('Error while toggling property visibility:', error);
        }
    };

    const handleUpdateTour = async () => {
        if (tourDate && tourTime) {
            const jsonBlobUrl = process.env.REACT_APP_JSON_URL;

            try {
                const index = propertyData.findIndex(property => property.id === clonedSelectedMarker.id);

                if (index !== -1) {
                    let dataToSubmit = [...propertyData];

                    dataToSubmit[index] = {
                        ...dataToSubmit[index],
                        tour: {
                            date: tourDate,
                            time: tourTime,
                            hasTour
                        }
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
                        console.log('Tour data submitted successfully to jsonblob');

                        const data = await response.json();
                        handleUpatePositions(data.record);
                        openSnackbar('Tour updated successfully.', 3000);
                    } else {
                        openSnackbar('Error updating tour.', 3000);
                        console.error('Failed to submit tour data to jsonblob');
                    }
                } else {
                    openSnackbar('An entry with id ' + clonedSelectedMarker.id + ' does not exist.', 3000);
                    console.log(`An entry with id ${clonedSelectedMarker.id} does not exist.`);
                }
            } catch (error) {
                openSnackbar('Error submitting tour.', 3000);
                console.error('Error submitting tour data to jsonblob:', error);
            }
        } else {
            openSnackbar('Invalid tour date or time.', 3000);
            console.log('Invalid tour date or time provided.');
        }
        setShowNotepad(false);
    };



    return (
        <>
            <div className='property-details'>
                <div className="address-container">
                    <div className="address-info">
                        <p className='address'>{clonedSelectedMarker.name}</p>
                        <p className='city-state-zip'>{clonedSelectedMarker.location.city}, {clonedSelectedMarker.location.state} {clonedSelectedMarker.location.zip}</p>
                    </div>
                    {
                        clonedSelectedMarker.apartmentName && (
                            <p className='apartment-name'><Image image={Apartment} classes={'property-image'} /> {clonedSelectedMarker.apartmentName}</p>
                        )
                    }
                    <div className="property-size-container">
                        <span className="property-size"><img className="property-image" src={Bed} alt="Bed" /> {clonedSelectedMarker.beds}</span>
                        <span className="property-size"><img className="property-image" src={Bath} alt="Bath" /> {clonedSelectedMarker.baths}</span>
                        {
                            selectedMarker.tour.hasTour && (
                                <span className="property-size"><img className="property-image" src={Calendar} alt="Calendar" /> {clonedSelectedMarker.tour.date + ' ' + clonedSelectedMarker.tour.time}</span>
                            )
                        }
                        <span className='property-size'><img className="property-image" src={Money} alt="Dollar" /> {parseInt(clonedSelectedMarker.price, 10).toLocaleString()}</span>
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
                <div>
                    <Chart data={clonedSelectedMarker.historicalPrices} />
                </div>
                <div className='action-buttons notes-context'>
                    <button className='view-on-google' onClick={() => handleMaps(clonedSelectedMarker.location.address)}>
                        {/* Ensure GMaps image source is correctly defined above this component or imported */}
                        <img className='gmaps-logo' src={GMaps} alt="Google Maps" />
                    </button>
                    <button className='add-notes-button' onClick={() => setShowNotepad(true)}><BiMessageRoundedAdd className="nav-icon-svg" /></button>
                    <button onClick={handleToggleFavorite} className="like-button">
                        <img className="like-image" src={clonedSelectedMarker.isFavorited ? Heart : Like} alt="like" />
                    </button>
                    <button onClick={handleToggleHideProperty}><LuTrash /></button>
                </div>
            </div>
            {
                showNotepad && (
                    <div className="notepad-overlay">
                        <div className="pricepad">
                            <div className="price-update-container">
                                <input placeholder="$" onChange={(e) => setPrice(e.target.value)} type="number" />
                                <button onClick={handleAddPrice}>Update</button>
                            </div>
                        </div>
                        <div className="tourpad">
                            <div className="tour-update-container">
                                <input placeholder="04/27" type="text" onChange={(e) => setTourDate(e.target.value)} />
                                <input placeholder="3:00PM" type="text" onChange={(e) => setTourTime(e.target.value)} />
                                <label>
                                    <input type="checkbox" onChange={(e) => setHasTour(e.target.checked)} />
                                    <span>Tour</span>
                                </label>
                                <button onClick={handleUpdateTour}>Schedule</button>
                            </div>
                        </div>
                        <div className="notepad">
                            <textarea onClick={(e) => e.stopPropagation()} onChange={(e) => setNote(e.target.value)} placeholder="Add a note" />
                            <div className="action-buttons">
                                <button onClick={() => setShowNotepad(false)}>Cancel</button>
                                <button onClick={handleAddNote}>Add Note</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>

    );
};
