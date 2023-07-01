import { useDispatch, useSelector} from 'react-redux';
import {fetchDetailSpot} from '../../store/spots';
import { useEffect } from 'react';
import {useParams} from 'react-router-dom';
import * as reviewsAction from '../../store/reviews';
import ReviewSpotModal from '../Reviews/ReviewForm/ReviewFormModal';
import DeleteReviewModal from '../Reviews/DeleteModal';

import './SpotDetail.css';

export function SpotDetail() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots );
    const sessionUser = useSelector(state => state.session.user)
    const reviewObj = useSelector((state) => state.reviews);
    const spotReviews = Object.values(reviewObj.spot);

    let sum = 0;
    let avgRating = 0;

    for (let review of spotReviews) {
        sum += review.stars;
    }
    if (sum > 0) {
        avgRating = (sum / spotReviews.length).toFixed(2);
    }

    useEffect(() => {
        dispatch(fetchDetailSpot(spotId));
        dispatch(reviewsAction.fetchSpotReviews(spotId))
    }, [dispatch, spotId]);



    if(spot && spot.statusCode) return (
        <div className='not-found'>
            <h2>Sorry, the listing couldnt be found</h2>
        </div>
    )
    return (

     <div className="spot-container">
        <div className="spot-info">
            <h2 className="spot-info-firstline">{spot.name}</h2>
            <div className="spot-info-secondline">
                <i className="fa-solid fa-star"> </i>
                {avgRating}.  {spotReviews.length} reviews. {spot.city}, {spot.state}, {spot.country}

            </div>
            <div className='share-save'>
            <i class="fas fa-share"></i>
                share .
            <i class="fa-regular fa-heart"></i>
                save
            </div>
        </div>
        <div className="spot-photo">
             {spot.SpotImages?.length > 0 &&
                <div className='spot-photo-container photo-one'>
                    <img src={spot.SpotImages[0].url} alt='spot'/>
                </div>
            }
               <div className='spot-photo-container photo-four'>
                    <div className='photo-four1'>
                        <img src='https://casacloudpics.s3.us-east-2.amazonaws.com/casacloudpics/J1.jpg' alt='spot'/>
                    </div>
                    <div className='photo-four1'>
                         <img src='https://casacloudpics.s3.us-east-2.amazonaws.com/casacloudpics/H1.jpg' alt='spot' className="photo-border1"/>
                    </div>
                    <div className='photo-four1'>
                        <img src='https://casacloudpics.s3.us-east-2.amazonaws.com/casacloudpics/L2.jpg' alt='spot'/>
                    </div>
                    <div className='photo-four1'>
                        <img src='https://casacloudpics.s3.us-east-2.amazonaws.com/casacloudpics/K3.jpg' alt='spot'className="photo-border2"/>
                    </div>
            </div>
        </div>
            <div className="spot-detail-container">
                <div className="spot-host-container">
                    <div className="spot-host">
                        {spot.Owner &&
                            <div className="host-name">
                                <h2>This place hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
                                <p>4 guests . 2 bedrooms . 3 beds . 1bath</p>
                            </div>
                        }
                        <div>
                            <img src="https://casacloudpics.s3.us-east-2.amazonaws.com/casacloudpics/shikamaru.jpg" alt='brown' className="profile-photo"/>
                        </div>
                    </div>
                </div>
                 {/* <div className="spot-price">
                 <BookingCalendar avgRating={avgRating} reviews={spotReviews.length} price={spot.price} id={spot.id} spotBooking={spotBooking} user={sessionUser} />
            </div> */}

            <div className="spot-mockup1">
                    <div className="mockup-item">
                        <i className="fa-solid fa-check"></i> Self Checkin
                        <p style={{fontSize:13, marginLeft:10}}>Check yourself in with the smartlock.</p>
                    </div>
                    <div className="mockup-item">
                        <i className="fa-solid fa-location-pin"></i>Designed by
                        <p style={{fontSize:13, marginLeft:10}}>Vivi Truong from 999 Architect.co</p>
                    </div>
                    <div className="mockup-item">
                    <i className="fa-solid fa-calendar"></i> Free cancellation for 48 hours.
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
                <div className="spot-review">
                    <div className="reviews-container">
                        <p style={{fontWeight:700, fontSize:20}}> <i className="fa-solid fa-star" style={{fontSize:17}}></i>{avgRating} - {spotReviews.length} reviews</p>
                        <div className="reviews-cards">
                            {spotReviews?.length > 0 && spotReviews.map(review => (
                                <div key={review.id} className='review-user-container'>
                                    <div className="reviewer-info">

                                        <div className="review-user-photo">
                                            <img src='https://casacloudpics.s3.us-east-2.amazonaws.com/casacloudpics/choji.jpg' alt='cony' className="user-profile"/>
                                        </div>
                                        <div className="review-name">{review.User.firstName}</div>
                                    </div>
                                    <div className="review-description">{review.review}</div>
                                    <div className="review-delete">
                                        {sessionUser && +review.userId === sessionUser.id &&
                                            <DeleteReviewModal reviewId={review.id} spotId={spot.id} />
                                        }

                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="btn-newreview">
                            <ReviewSpotModal spotId={spot.id} />
                        </div>

                        </div>
                </div>
            </div>
        </div>

    )
}
