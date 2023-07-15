import React, {useState} from "react";
import { Modal } from "../../../context/Modal";
import { ReviewForm } from ".";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ReviewSpotModal({spotId}){
    const [showModal, setShowModal] = useState(false);

    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots );
    const sessionUser = useSelector(state => state.session.user)
    const reviewObj = useSelector((state) => state.reviews);
    const spotReviews = Object.values(reviewObj.spot);
    const spotBooking = useSelector(state => state.bookings.spot);
    const usersObj = useSelector(state => state.user)
    const { ownerId} = useParams();
    const spotOwner = spot.ownerId;
    const isCurrOwner = sessionUser && sessionUser.id === spotOwner;
    const hasPostedReview = spotReviews.find((review) => review.userId === sessionUser?.id);

    const handleClick = () => {
      setShowModal(true);
    };

    return (
      <>
        {!isCurrOwner && !hasPostedReview && sessionUser && (
          <button onClick={handleClick} className="btn-create">
            Post a Review
          </button>
        )}
        {showModal && (
          <Modal>
            <ReviewForm spotId={spotId} onClose={() => setShowModal(false)} />
          </Modal>
        )}
      </>
    );
  }

    // return (
    //     <>
    //       <button onClick={() => setShowModal(true)} className='btn-create'>Post a Review</button>
    //       {showModal && (
    //         <Modal>
    //           <ReviewForm spotId={spotId} onClose={() => setShowModal(false)} />
    //         </Modal>
    //       )}
    //     </>
    //   );
    // }
