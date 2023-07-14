import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as reviewActions from "../../../store/reviews";
import * as spotsActions from '../../../store/spots'
import './index.css'


export function ReviewForm(props) {
    const [rating, setRating] = useState();
    const [review, setReview] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);
    const dispatch = useDispatch();
    const modal = props.onClose;
    const spotId = props.spotId;
    const sessionUser = useSelector(state => state.session.user);
    const [isCommentValid, setIsCommentValid] = useState(false);
    const [isRatingValid, setIsRatingValid] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(null);
    const history = useHistory();

    const reviewObj = useSelector(state => state.reviews)
    const reviews = Object.values(reviewObj)
    // const hasPostedReview = reviews.find((review) => sessionUser.id === review.userId)
    const spot = useSelector(state => Object.values(state.spots))
    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors([]);
        if (!sessionUser) return setValidationErrors(['Please login to rate this spot'])
        const info = {
            stars: rating, review
        }
        if (!review) return setValidationErrors([`Please input your review!`])
        dispatch(reviewActions.createReview(spotId, info))
            .then(() => modal())
            .catch(async (res) => {
                        const data = await res.json();
                if (data && data.message) {
                    if (data.errors) {
                        const error = Object.values(data.errors)
                        return setValidationErrors([error])
                    }
                        setValidationErrors(['You already rated this spot!']);
                        }
            });
        history.push(`/spots/${spotId}`);
    }

    const handleCancelButton = (e) => {
        e.preventDefault();
        modal();
    }

    const Star = ({ filled, onClick, onMouseEnter, onMouseLeave }) => {
        return (
          <span
            className={`star ${filled ? 'filled' : ''}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          ></span>
        );
      };

    return (
        <div className="reviewform-container">
            <div className="reviewform-welcome">
                <h2>How was your stay?</h2>
            </div>
            <form onSubmit={handleSubmit} className='reviewform-info'>
                <div>
                {validationErrors.length > 0 &&
                    <ul>
                        {validationErrors.map(error =>
                            <li key={error}>{error}</li>)}
                    </ul>
                }
                </div>
                <div className="reviewform-description">
                            <label>
                                <textarea
                                    placeholder='Leave your review here...(minimum 10 characters)'
                                    value={review}
                                    onChange={(e) => {
                                        setReview(e.target.value);
                                        setIsCommentValid(e.target.value.length >= 10);
                                    }}
                                    className='input-field'
                                    required
                                >
                                </textarea>
                            </label>
                        </div>
                        <div className="review-content">
                            <div className="reviewform-rating">
                                <label>Stars:</label>
                                {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    filled={star <= (hoveredRating || rating)}
                                    onClick={() => {
                                    setRating(star);
                                    setIsRatingValid(star >= 1);
                                    }}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(null)}
                                />
                                ))}
                            </div>
                    <div className="review-button">

                <button type="submit" className="btn-post" disabled={!isCommentValid || !isRatingValid}>
                    Submit your Review
                </button>


                    </div>
                    <div>
                    <button onClick={handleCancelButton} className='btn-cancel'>Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    )
}
// setIsRatingValid((e.target.value >= 1))
