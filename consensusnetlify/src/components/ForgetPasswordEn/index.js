import React, {useState, useContext, useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';
import "../ForgetPassword/forget.css";


const ForgetPasswordEn = (props) => {

    const firebase = useContext(FirebaseContext);

    const [userSession, setUserSession] = useState(null);

    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let listener = firebase.auth.onAuthStateChanged(user => {
            !user ? setUserSession(user) : props.history.push("/landing");
        });
        return () => {
            listener()
        };
    }, [])

    const handleSubmit = e => {
        e.preventDefault();
        firebase.passwordReset(email)
        .then(() => {
            setError(null);
            setSuccess(`Please check your email inbox : ${email} to change your password `);
            setEmail("");
            // redirect to login page after 5s :
            setTimeout(() => {
                props.history.push("/En");
            }, 5000)
        })
        .catch( error => {
            setError(error);
            setEmail("");
        })
    }

    const disabled = email === "";

    const messageSuccess = success && <span>{success}</span>
    const messageError = error && <span>{error.message}</span>

    return userSession !== null ? 
        (<div className="loading"><div className="d-flex align-items-center">
        <strong>Loading ...</strong>
        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
      </div></div>)
    : 
( 
    <><header className="header">
        
                <nav className="navbar-global">
                    <div className="app-title">
                        <h1 className='consensus-title'>ConsensUs</h1><style>@import url('https://fonts.googleapis.com/css2?family=Palanquin+Dark:wght@400;500;700&display=swap');</style>
                        <div className="navbar-subtitle">
                        <NavLink className="home-link-nav" to="/login">Home</NavLink>
                        <NavLink className="about-link-nav" to="aboutNotConnected">About</NavLink>
                        <NavLink className="help-link-nav" to="help">Help</NavLink>
                        <NavLink className="login-link-nav" to="login">Login</NavLink>
                        </div>
                    </div>
                </nav>
            </header>
            <h1 className='slogan'>Change Password</h1>
            <span className='account-to-recup'><strong>Account to recover</strong></span>
        <div className="content-forget">
                
                
            {messageSuccess}
            {messageError}
            <form onSubmit={handleSubmit}>
            <div className="inputForm-recuperation">
                <div>
                    <input onChange={e => {setEmail(e.target.value)}} value={email} type="email" id="email" autoComplete="off" required placeholder="Email Address"/>
                </div>
               <button disabled={disabled}className='oui'>Recover</button>
            </div>
            </form>
        </div>
        </>
    )
};

export default ForgetPasswordEn;
