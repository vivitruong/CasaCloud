import React, { useState } from "react";
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import { Modal } from "../../context/Modal";
import LoginFormPage from "../LoginFormPage";
import SignupFormPage from "../SignupFormPage";
import Button from "../Buttons";
import Host from "../CreateSpots";
import './Navigation.css';
import logo from './casa-cloud-logo.png';

export default function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const [showModal, setShowModal] = useState(false);
    const [login, setLogin] = useState(true);

    return (
        <div className="navigation">
            <div className="navigation-logo">
                <NavLink exact to='/'><img className="logo-img" src={logo} alt='logo' style={{width: 100, height: 90} } /></NavLink>
            </div>
            <div className="navigation-mid">
                <div className="search-container">
                    <Button child={
                        <div className="search-where">
                            <span>Anywhere</span>
                        </div>
                    } />
                    <Button child={
                        <div className="search-time">
                            <span>Any week</span>
                        </div>
                    } />
                    <Button child={
                        <div className="search-guest">
                                <span>Add guests</span>
                            <div className="btn-container">
                                <button className="btn-search"><i className="fa-solid fa-magnifying-glass" style={{ fontSize: 12 }}></i></button>
                            </div>
                        </div>
                    }/>
                </div>

            </div>
            <div className="navigation-bar">
                {isLoaded && (
                    <>
                    <ProfileButton
                        user={sessionUser}
                        setLogin={setLogin}
                        setShowModal={setShowModal}
                    />
                        <div className="link-createspot">
                            <Host />
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
