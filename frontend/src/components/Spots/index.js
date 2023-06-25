import { useSelector, useDispatch } from "react-redux";

import React, {useEffect, useState} from 'react';
import * as spotActions from "../../store/spots.js";
import SpotCard from "./SpotCard";

function AllSpots () {
    let dispatch = useDispatch()
    const spotList = useSelector((state) => Object.values(state.spots))
    console.log(spotList)
    useEffect(() => {
        dispatch(spotActions.getAllSpots())
        // dispatch(spotsActions.getOwnedSpots())
    }, [dispatch])

    return (
        <div className="allSpots">
        <div className="spotsContainer">
            <div className="spots-grid">
                {spotList.map((spots) => (
                    <SpotCard key={spots.id} spots={spots} />
                ))}
        </div>
            </div>
        </div>
    )
            }

export default AllSpots
