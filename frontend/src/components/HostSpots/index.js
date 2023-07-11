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
            <div className='manage-page'>
                <div className='manage-welcome'>
                    <h2>Welcome, {sessionUser.firstName}! </h2>
                </div>
                {spots.length > 0 && spots.map(spot =>
                    <div key={spot.id} className='manage-container'>
                        <div>
                            <img src={spot.previewImage} alt='spot' style={{height:"200px"}}></img>
                        </div>
                        <div className='manage-name'>
                            <Link to={`/spots/${spot.id}`}>{spot.name}</Link>
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
        }
    </div>
)

}
