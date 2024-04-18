import './PropertyList.css';
import Heart from './images/heart.png';


const PropertyCard = ({ property, handleSelectedMarker }) => {
    const { name, beds, baths, price, imageUrls, isFavorited } = property;
    
    return (
        <div className="property-card">
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
                
            </div>
        </div>
    );
};

export const ListView = ({ properties, handleSelectedMarker }) => {
    return (
        <div className="property-list">
            {properties.map(property => (
                <PropertyCard key={property.id} property={property } handleSelectedMarker={handleSelectedMarker} />
            ))}
        </div>
    );
};