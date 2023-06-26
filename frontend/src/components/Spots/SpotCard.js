import {Link} from 'react-router-dom';
import React from 'react';
import './spots.css';

const SpotCard = ({spots}) => {
    return (
        <>

        <Link className='card-container' to={`/spots/${spots.id}/${spots.ownerId}`}>
            <div className='card-container'>
                <img className="spot-img" src={spots.previewImage} alt='previewImage' />
                <div className="spot-description">
                <div className="bottom-descriptions">
                <div className='location'>{spots.city}, {spots.state}
                </div>
                <div className='spot-price'>{`$${spots.price} night`}
                </div>
        <div className='bottom-description'>
                <div className='star-rating'>
                <i className="fa-solid fa-star"></i>
                <div className="spotRating">{spots.AvgRating ? spots.AvgRating : 0}</div>
                </div>
                </div>
                </div>
            </div>
        </div>
        </Link>
        </>

    )
}

export default SpotCard;
