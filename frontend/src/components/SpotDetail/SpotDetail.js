import { useDispatch, useSelector, useSelectore} from 'react-redux';
import {fetchDetailSpot} from '../../store/spots';
import { useEffect } from 'react';
import {useParams} from 'react-router-dom';

import './SpotDetail.css';

export function SpotDetail() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots );
    const sessionUser = useSelector(state => state.session.user)

    useEffect(() => {
        dispatch(fetchDetailSpot(spotId))
    }, [dispatch, spotId]);


    if(spot && spot.statusCode) return (
        <div className='not-found'>
            <h2>Sorry, the listing couldnt be found</h2>
        </div>
    )
    return (
        <>
        <div>
            {spot.SpotImages?.length > 0 &&
            <div className='spot-photo-container photo-one'>
                <img src={spot.SpotImages[0].url} alt='spot' />
            </div>
            }

            <div className='spot-photo-container photo-four'>
                <div className='photo-four1'>
                    <img src='https://casacloudpics.s3.us-east-2.amazonaws.com/casacloudpics/J1.jpg'/>
                </div>
                <div className='photo-four1'>
                    <img src='https://casacloudpics.s3.us-east-2.amazonaws.com/casacloudpics/H1.jpg'/>
                </div>
                <div className='photo-four1'>
                    <img src='https://casacloudpics.s3.us-east-2.amazonaws.com/casacloudpics/L2.jpg'/>
                </div>
                <div className='photo-four1'>
                    <img src='https://casacloudpics.s3.us-east-2.amazonaws.com/casacloudpics/K3.jpg'/>
                </div>
            </div>
            <div className="spot-detail-container">
                <div className="spot-host-container">
                    <div className="spot-host">
                        {spot.Owner &&
                            <div className="host-name">
                                <h2>This place hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
                            </div>
                        }
                        <div>
                            <img src="https://casacloudpics.s3.us-east-2.amazonaws.com/casacloudpics/shikamaru.jpg" alt='brown' className="profile-photo"/>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="spot-price">
                    {/* ${spot.price} <span style={{fontWeight:300}}>/night</span> */}
                    {/* <BookingCalendar avgRating={avgRating} reviews={spotReviews.length} price={spot.price} id={spot.id} spotBooking={spotBooking} user={sessionUser} /> */}

                    <div className="spot-mockup1">
                    <div className="mockup-item">
                        <i className="fa-solid fa-check"></i> Self Checkin
                    </div>
                    <div className="mockup-item">
                        <i className="fa-solid fa-location-pin"></i> Excellent Location
                    </div>
                    <div className="mockup-item">
                    <i className="fa-solid fa-calendar"></i> Free cancellation
                    </div>
                    <div className='mockup-item'>
                    <i className="fa-solid fa-square-parking"></i> Covered Parking
                    </div>
                </div>
                <div className="spot-mockup">
                <div>
                        <h2>WHAT WE COVER</h2>
                    </div>
                    <div className="mockup-para">
                        <p>At CasaCloud, we prioritize your peace of mind throughout the booking process and your stay. That's why every booking with us includes free protection from host cancellations, listing inaccuracies, and other potential issues you may encounter during your trip. We're here to ensure a smooth and worry-free experience from check-in to check-out.
                        </p>
                    </div>
                </div>
                <div className="spot-desc">
                    <div className="spot-h2">
                        <h2>About this spot</h2>
                    </div>
                    <div className="spot-desc-detail">
                        <p>
                            {spot.description}
                        </p>
                    </div>
                </div>

        </div>
        </>
    )
}
