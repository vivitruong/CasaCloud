import { useSelector, useDispatch } from "react-redux";
import Headliner from "../HeadLiner/index.js";
import React, {useEffect} from 'react';
import * as spotActions from "../../store/spots.js";
import './spots.css';
import Spinner from "../GridLoad/index.js";
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';





function AllSpots () {
    let dispatch = useDispatch()
    const spotObj = useSelector((state) => state.spots);
    const spotList = Object.values(spotObj)
    // console.log(spotList)
    useEffect(() => {
        dispatch(spotActions.getAllSpots())
    }, [dispatch])


    return (
        <>
        <div className='spothead-container'>
            <Headliner dispatch={dispatch} />
        </div>
        <div className='spots-container'>
            { spotList?.length > 0 && typeof spotList[0] === 'object' && spotList.map(spot => (
                <Link to={`/spots/${spot.id}`} key={spot.id}>
                    <div key={spot.id} className='spot-card'>
                    {/* <Tooltip effect="solid" place="top" /> */}
                        <div className='spot-image'>
                            <img src={spot.previewImage} alt='spot'/>
                        </div>
                        {/* <div className='heart-likes'>
                        <i class="fa-regular fa-heart"></i>
                        </div> */}
                        <div className='spot-name-row'>
                            <div className='spot-name'>{spot.city}, {spot.state}</div>
                            <div style={{fontSize:14}}>

                            <i className="fa-solid fa-star"></i>{spot.AvgRating ? spot.AvgRating : "New"}
                            </div>
                        </div>
                        <div className='spot-name-info'>
                            <div style={{fontSize:13}}>June 15 - 20</div>
                            <div style={{fontSize: 13}}>666 miles away</div>
                        </div>
                        <div className='spot-name-info' style={{fontWeight:700}}>
                            ${spot.price} <span style={{fontWeight:300}}>night</span>
                        </div>

                    </div>

                </Link>
            ))}

        </div>
        {
            spotList.length === 0 &&
            <div className='spot-spinner'>
                <Spinner/>
            </div>

        }
    </>
)
}

export default AllSpots
