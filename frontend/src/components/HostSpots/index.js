import { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserSpots } from '../../store/spots';
import EditSpotModal from './EditSpotModal';
import DeleteSpotModal from './DeleteSpotModal';
import { Link } from 'react-router-dom';
import './index.css'


export function HostingSpots() {

    const sessionUser = useSelector((state) => state.session.user);
    const dispatch = useDispatch();
    const spots = useSelector(state => Object.values(state.spots))

    useEffect(() => {
        dispatch(getUserSpots())
    },[dispatch])


    return(
        <div className='manage-main'>
        {!sessionUser &&
            <div>
                <h2>Please login to see the content</h2>
            </div>
        }
        {sessionUser &&
            <div className='manage-welcome'>
                <h2 style={{color: 'grey'}}>Welcome, {sessionUser.firstName} ! Manage Your Spots </h2>
                <div className='btn-link-createee'>
                <button className='link-createee'>
                <Link to='/spots/new' className="create-spot-linkk">Create a New Spot</Link>
                </button>
                </div>
            <div className='manage-page'>
                {spots.length > 0 && spots.map(spot =>
                    <div key={spot.id} className='manage-container'>
                        {spot && spot.previewImage &&
                        <div className='spot-image'>
                          <img src={spot.previewImage} alt='spot' style={{height:"200px"}}></img>
                        </div>
}

                        <div className='manage-name'>
                            <Link to={`/spots/${spot.id}`}>{spot.name}</Link>
                        </div>

                        <div className='spot-name-row'>
                            <div className='spot-name'>{spot.city}, {spot.state}</div>
                            <div style={{fontSize:14}}>

                            <i className="fa-solid fa-star"></i>{spot.AvgRating ? spot.AvgRating : "New"}
                            </div>
                        </div>
                        <div className='spot-name-info' style={{fontWeight:700}}>
                            ${spot.price} <span style={{fontWeight:300}}>night</span>
                        </div>

                        <div className='manage-change'>
                            <div className='update'>
                                <EditSpotModal spot={spot} />
                            </div>
                            <div className='delete'>
                                <DeleteSpotModal spot={spot}/>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            </div>
        }

    </div>

)

}
