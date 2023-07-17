import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from '../../store/session';
import { Link } from "react-router-dom";
import './ProfileButton.css';
import { useHistory } from "react-router-dom";

export default function ProfileButton({ user, setLogin, setShowModal }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const history = useHistory()

    const onClickMenuButton = (e) => {
        e.stopPropagation();
        if (showMenu) {
            setShowMenu(false);
            return;
        }
        setShowMenu(true);
    }

    useEffect(() => {
        if (!showMenu) {
            return;
        }

        const closeMenu = (e) => {
            e.stopPropagation();
            setShowMenu(false);
        }

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.userLogout());
        setShowMenu(false);
        history.push('/')
    };
    const handleDemoButton = (e) => {
        e.preventDefault();
        return dispatch(sessionActions.userLogin({
            credential: 'Demo-lition',
            password: 'password'
        }))
            .then(() => setShowModal(false));
    }

    return (
        <>
            <div className="profile-btn">
                <button onClick={onClickMenuButton}>
                <i className="fa-solid fa-bars menu-btn"></i>
                    <i className="fas fa-user-circle" />
                </button>
            </div>
            {showMenu && (user ?
                <div className="dropdown">
                    <ul className="profile-dropdown">
                        <div className="dropdown-user">
                            <div>
                                Hello, {user.firstName}!
                            </div>
                            <div>
                                {user.email}
                            </div>
                        </div>
                        <div className="dropdown-link">
                            <Link to='/hosting' className="hosting">Manage Listings</Link>
                        </div>
                        <div className="dropdown-link">
                            <Link to='/bookings' className="hosting">My Bookings</Link>
                        </div>
                        <div className="dropdown-link drop-down-account"
                            onClick={() => history.push(`/users/account/${user.id}`)}
                        >
                            Account
                        </div>

                        <div className="dropdown-link">

                            <button onClick={logout} className='dropdown-btn'>Log out</button>

                        </div>
                    </ul>
                </div>: (
                    <div className="dropdown">
                        <ul className="profile-dropdown">
                            <li>
                                <button onClick={() => {
                                    setLogin(true)
                                    setShowModal(true)
                                }} className='dropdown-btn'>Login</button>
                                <Link to='/login'></Link>

                            </li>
                            <li>
                                <button onClick={() => {
                                    setLogin(false)
                                    setShowModal(true)
                                }} className='dropdown-btn'>SignUp</button>
                                <Link to='/signup'></Link>
                            </li>
                            <li>
                                <button onClick={handleDemoButton} className='dropdown-btn'>Demo User</button>
                            </li>
                        </ul>
                    </div>
                )
            )}
        </>
    )
}
