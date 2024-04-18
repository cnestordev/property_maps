import './PropertyList.css';
import Heart from './images/heart.png';
import Calendar from './images/calendar.png';


const PropertyCard = ({ property, handleSelectedMarker, selectedMarker }) => {
    const { name, beds, baths, price, imageUrls, isFavorited, tour } = property;

    return (
        <div className={`property-card ${selectedMarker?.id === property.id ? 'card-selected' : ''}`}>
            <div className='card-image-container'>
                <img onClick={() => handleSelectedMarker(property)} src={imageUrls[0]} alt={name} className="property-card-image" />
            </div>
            <div className="property-card-info">
                <span className='property-card-header'>
                    <h2 className='property-card-name property-card-details'>{name}</h2>
                    {
                        isFavorited && <img className='property-card-heart' src={Heart} alt="heart" />
                    }
                </span>
                <p className='property-card-details'>{`${beds} Beds | ${baths} Baths | $${price}`}</p>
                {
                    tour?.hasTour && (
                        <span className='tour-info'>
                            <img style={{ width: '20px' }} className='property-card-tour' src={Calendar} alt="calendar" /> <p>{tour.date} {tour.time}</p>
                        </span>
                    )
                }

            </div>
        </div>
    );
};

export const ListView = ({ properties, handleSelectedMarker, selectedMarker }) => {
    return (
        <div className="property-list">
            {properties.map(property => (
                <PropertyCard key={property.id} property={property} handleSelectedMarker={handleSelectedMarker} selectedMarker={selectedMarker} />
            ))}
        </div>
    );
};