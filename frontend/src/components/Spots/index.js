import { useSelector, useDispatch } from "react-redux";
import Headliner from "../HeadLiner/index.js";
import React, {useEffect} from 'react';
import * as spotActions from "../../store/spots.js";
import SpotCard from "./SpotCard";
import './spots.css'

function AllSpots () {
    let dispatch = useDispatch()
    const spotList = useSelector((state) => Object.values(state.spots))
    console.log(spotList)
    useEffect(() => {
        dispatch(spotActions.getAllSpots())
    }, [dispatch])

    return (
        <>
        <div className='spothead-container'>
        <Headliner dispatch={dispatch} />
         </div>

        <div className="allSpots">
        <div className="spotsContainer">
            <div className="spots-grid">
                {spotList.map((spots) => (
                    <SpotCard key={spots.id} spots={spots} />
                ))}
        </div>
            </div>
        </div>
        </>
    )
            }

export default AllSpots
