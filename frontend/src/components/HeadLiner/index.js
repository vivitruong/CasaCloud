import Button from "../Buttons";
import './index.css';
import amazingpools from '../HeadLiner/imgHeadliner/amazingpools.jpg'
import omg from '../HeadLiner/imgHeadliner/omg.jpg'
import amazingview from '../HeadLiner/imgHeadliner/amazingviews.jpg';
import cabin from '../HeadLiner/imgHeadliner/cabin.jpg';
import boats from '../HeadLiner/imgHeadliner/boats.jpg'
import ski from '../HeadLiner/imgHeadliner/ski.jpg';
import lakefront from '../HeadLiner/imgHeadliner/lakefront.jpg';
import mansion from '../HeadLiner/imgHeadliner/mansion.jpg';
import treehouse from '../HeadLiner/imgHeadliner/treehouse.jpg';
import trending from '../HeadLiner/imgHeadliner/trending.jpg';
import catsle from '../HeadLiner/imgHeadliner/catsle.jpg';
// import Filter from "./Filter/Filter";
import FilterModal from "./Filter";


const Headliner = ({dispatch}) => {
    return (
        <>
        <Button child={
            <div className="headliner-icon">
                <img className="headliner-img" src={cabin}></img>
                <span>Cabin</span>
            </div>

        }/>
            <Button child={
            <div className="headliner-icon">
                <img className="headliner-img" src={amazingpools}></img>
                <span>Pools</span>
            </div>
        }/>
            <Button child={
            <div className="headliner-icon">
                <img className="headliner-img" src={amazingview}></img>
                <span>Views</span>
            </div>
        }/>
         <Button child={
            <div className="headliner-icon">
                <img className="headliner-img" src={boats}></img>
                <span>Boats</span>
            </div>
        }/>
         <Button child={
            <div className="headliner-icon">
                <img className="headliner-img" src={ski}></img>
                <span>Ski-in/out</span>
            </div>
        }/>
         <Button child={
            <div className="headliner-icon">
                <img className="headliner-img" src={lakefront}></img>
                <span>Lakefront</span>
            </div>
        }/>
         <Button child={
            <div className="headliner-icon">
                <img className="headliner-img" src={mansion}></img>
                <span>Mansion</span>
            </div>
        }/>
         <Button child={
            <div className="headliner-icon">
                <img className="headliner-img" src={omg}></img>
                <span>OMG!</span>
            </div>
        }/>
         <Button child={
            <div className="headliner-icon">
                <img className="headliner-img" src={treehouse}></img>
                <span>Treehouses</span>
            </div>
        }/>
           <Button child={
            <div className="headliner-icon">
                <img className="headliner-img" src={trending}></img>
                <span>Trending</span>
            </div>
        }/>
           <Button child={
            <div className="headliner-icon">
                <img className="headliner-img" src={catsle}></img>
                <span>Castles</span>
            </div>
        }/>
        <FilterModal dispatch={dispatch} />
        </>
    )
};

export default Headliner;
