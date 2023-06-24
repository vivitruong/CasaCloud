import { useSelector, useDispatch } from "react-redux";
// import SpotCard from "./SpotCard";
import './spots.css'
import allSpots from '../../store/spots.js'
// import '../ALLCSS/SpotDetails.css'

import React, { useEffect, useState } from "react";


function AllSpots() {
    let dispatch = useDispatch()
    // const _spots = useSelector((state) => Object.values(state.spots))

    useEffect(() => {
        dispatch(allSpots())
        // dispatch(spotsActions.getOwnedSpots())
    }, [dispatch])
        return (
            <>h2</>
            // <div className="allSpots">
            // <div className="spotsContainer">
            //     <div className="spots-grid">
            //         {_spots.map((spots) => (
            //             <SpotCard key={spots.id} spots={spots} />
            //         ))}
            // </div>
            //     </div>
            // </div>
        )
}


export default AllSpots
