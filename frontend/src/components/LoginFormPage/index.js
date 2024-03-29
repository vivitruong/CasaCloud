import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import "./LoginForm.css";

function LoginFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [validationError, setValidationErrors] = useState([]);


    if (sessionUser) return (
        <Redirect to="/" />
    );
    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationErrors({});
        if(credential.length < 4 || password.length < 6) {
            setValidationErrors(['Username must be at least 4 characters long', 'Password must be at least 6 characters long'])
            return;
        }
        return dispatch(sessionActions.userLogin({ credential, password })).catch(
          async (res) => {
            const data = await res.json();
            if (data && data.errors) setValidationErrors([`The provided credentials were invalid`]);
          }
        );
      };



    return (
        <div className='login-container'>
            <div className='login-header'>
                <h2>Log in</h2>
            </div>
            <form onSubmit={handleSubmit} className='login-form'>
                <div className='login-title'>
                    <h3>Welcome to CasaCloud</h3>
                </div>

                {validationError.length > 0 &&
                    <ul>
                        {validationError.map(error =>
                            <li key={error}>{error}</li>)}
                    </ul>
                }

                <div className='login-info'>
                    <div className='login-name'>
                        <label>
                            <input
                                type='text'
                                value={credential}
                                onChange={(e) => setCredential(e.target.value)}
                                required
                                placeholder='username/email'
                                className='login-input login-input-email'
                            />
                        </label>
                    </div>
                    <div className='login-password'>
                        <label>
                            <input
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder='password '
                                className='login-input'
                            />
                        </label>
                    </div>

                </div>
                <div className='login-button'>
                    <button className='login-btn' type='submit' disabled={credential.length < 4 || password.length < 6}>Log in</button>
                </div>

            </form>
        </div>
    )
}

export default LoginFormPage;
