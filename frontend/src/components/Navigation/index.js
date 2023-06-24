import React, { useState } from "react";
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import { Modal } from "../../context/Modal";
import LoginFormPage from "../LoginFormPage";
import SignupFormPage from "../SignupFormPage";
import './Navigation.css';

export default function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const [showModal, setShowModal] = useState(false);
    const [login, setLogin] = useState(true);

    return (
        <div className="navigation">
            <div className="navigation-logo">
                {/* <NavLink exact to='/'><img src={logo} alt='logo' style={{width:120, height:80} } /></NavLink> */}
            </div>
            {/* <div className="navigation-mid">
                <div className="search-container">
                    <LabelledButton child={
                        <div className="search-where">
                            <span>Anywhere</span>
                        </div>
                    } />
                    <LabelledButton child={
                        <div className="search-time">
                            <span>Any week</span>
                        </div>
                    } />
                    <LabelledButton child={
                        <div className="search-guest">
                                <span>Any Price</span>
                            <div className="btn-container">
                                <button className="btn-search"><i className="fa-solid fa-magnifying-glass" style={{ fontSize: 14 }}></i></button>
                            </div>
                        </div>
                    }/>
                </div>

            </div> */}
            <div className="navigation-bar">
                {isLoaded && (
                    <>
                    <ProfileButton
                        user={sessionUser}
                        setLogin={setLogin}
                        setShowModal={setShowModal}
                    />
                        <div className="link-createspot">
                            {/* <NewSpot /> */}
                        </div>
                    </>
                    )}
            </div>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    {login ? <LoginFormPage setShowModal={setShowModal}/> : <SignupFormPage setShowModal={setShowModal}/>}
                </Modal>
            )}
        </div>
    )
}
