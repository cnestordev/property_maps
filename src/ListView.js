import './PropertyList.css';
import Heart from './images/heart.png';
import Calendar from './images/calendar.png';


const PropertyCard = ({ property, handleSelectedMarker, handleUnselectedMarker, selectedMarker }) => {
    const { name, beds, baths, price, imageUrls, isFavorited, tour, apartmentName } = property;

    const handleListingWidgetToggler = () => {
        if (selectedMarker?.id === property.id) {
            handleUnselectedMarker();
        } else {
            handleSelectedMarker(property);
        }
    };

    return (
        <div className={`property-card ${selectedMarker?.id === property.id ? 'card-selected' : ''}`}>
            <div className='card-image-container'>
                <img onClick={() => handleListingWidgetToggler()} src={imageUrls[0]} alt={name} className="property-card-image" />
            </div>
            <div className="property-card-info">
                <span className='property-card-header'>
                    {
                        apartmentName && (
                            <h2 className='property-card-name property-card-details'>{apartmentName}</h2>
                        )
                    }
                    <h3 className='property-card-name property-card-details'>{name}</h3>
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

const groupPropertiesByCity = (properties) => {
    return properties.reduce((groups, property) => {
      const city = property.location.city;
      if (!groups[city]) {
        groups[city] = [];
      }
      groups[city].push(property);
      return groups;
    }, {});
  };
  
  export const ListView = ({ properties, handleSelectedMarker, handleUnselectedMarker, selectedMarker }) => {
    const groupedProperties = groupPropertiesByCity(properties);

    return (
        <div className="property-list">
            {Object.keys(groupedProperties).map(city => (
                <div key={city}>
                    <h2 className="city-header">{city}</h2>
                    {groupedProperties[city].map(property => (
                        <PropertyCard
                            handleUnselectedMarker={handleUnselectedMarker}
                            key={property.id}
                            property={property}
                            handleSelectedMarker={handleSelectedMarker}
                            selectedMarker={selectedMarker}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};
