import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as reviewsAction from '../../store/reviews'
import './ListingSpotReviews.css';

export function ListingSpotReviews({spotId}) {
    const dispatch = useDispatch();
    const reviews= useSelector(state => Object.values(state.reviews));

    const spotReviews = [];
    for (let review of reviews) {
        if (review.spotId === +spotId) {
            spotReviews.push(review);
        }
    }
    const totalReviews = spotReviews.length;


    useEffect(() => {
        dispatch(reviewsAction.getReviews(spotId))
    }, [dispatch])

    return (
        <div className="reviews-container">
            <h2>Total Reviews: {totalReviews}</h2>
            <div className="reviews-card">
                {spotReviews?.length > 0 && spotReviews.map(review => (
                    <div key={review.id} className='review-user-container'>
                        <div className="reviewer-info">
                            <div className="review-name">{review.User.firstName}</div>
                            <div>
                                <img src='https://casacloudpics.s3.us-east-2.amazonaws.com/casacloudpics/minato.jpg' alt='cony' className="user-profile"/>
                            </div>
                        </div>
                        <div className="review-content">{review.review}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
