import { useHistory , useParams} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllUsers } from "../../store/users";
// import { fetchSpotReviews } from "../../store/reviews";

import './UserProfile.css'

const UserAccount = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const {spotId} = useParams()
    const {bookingId} = useParams()
    const {userId} = useParams()


    // const reviews = useSelector(state => Object.values(state.reviews))
    const spots = useSelector(state => state.spots)
    const bookings = useSelector(state => state.bookings)
    const users = useSelector(state => state.users)


    const spot = spots[spotId]
    const currentBooked = bookings[bookingId]
    const currentUser = users[userId]
    const spotOwner = users[spot?.ownerId]

    useEffect(() => {
        // dispatch(fetchSpotReviews())
        dispatch(getAllUsers())
    },[dispatch])


    return (
        <div className="account-page-container">
      <div className="account-page-inner-container">

        <div className="account-page-left-side-container">
          <div className="account-page-user-info-container">

            <div className="account-page-user-info-one">
              <img className='account-page-user-info-pic' src='https://casacloudpics.s3.us-east-2.amazonaws.com/casacloudpics/shikamaru.jpg' alt='brown'></img>
              <div className="account-page-user-info-name">{`${currentUser?.firstName} ${currentUser?.lastName}`}</div>
            </div>

            {/* <div className="account-page-user-info-two">
              <i class="fa-regular fa-star fa-xl account-page-star"></i>
              <div className="account-page-user-info-review">{`${reviews?.length} reviews`}</div>
            </div> */}

            <div className="account-page-user-info-three">
              <i class="fa-regular fa-circle-check fa-xl account-page-check"></i>
              <div className="account-page-user-info-identity">Identity Verified</div>
            </div>

            <div className="account-page-user-info-four"></div>

            <div className="account-page-user-info-five">

              <div className="account-page-user-info-bottom-header">{`${currentUser?.firstName} confirmed`}</div>

              <div className="account-page-user-info-bottom">
                <i className="fa-solid fa-check fa-lg account-page-bottom-check"></i>
                <div className="account-page-user-info-detail">Goverment ID</div>
              </div>

              <div className="account-page-user-info-bottom">
                <i className="fa-solid fa-check fa-lg account-page-bottom-check"></i>
                <div className="account-page-user-info-detail">Phone Number</div>

              </div>
              <div className="account-page-user-info-bottom">
                <i className="fa-solid fa-check fa-lg account-page-bottom-check"></i>
                <div className="account-page-user-info-detail">Address Provided</div>
              </div>

            </div>

          </div>
        </div>

        <div className="account-page-right-side-container">

          <div className="account-page-right-side-top">
            <div className="account-page-right-side-header">{`Account, ${currentUser?.firstName}`}</div>
            <div className="account-page-right-side-text">Joined in 2023</div>
            {/* <div className="account-page-right-side-etc">Random text</div> */}
          </div>

          {/* <div className="account-page-right-side-bottom">
            <i className="fa-solid fa-star account-page-star-bottom"></i>
            <div className="account-page-right-bottom-review">{`${reviews?.length} reviews`}</div>
          </div> */}

        </div>
        {/* <div className="box-user-profile-info">
          <div className="personal-boxes">
            1
          </div>
          <div className="personal-boxes">
            1
          </div>
          <div className="personal-boxes">
            1
          </div>
          <div className="personal-boxes">
            1
          </div > */}


      </div>
    </div>
  );
}

export default UserAccount;
