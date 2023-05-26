import React, {useState, useContext, useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';
import "./forget.css";


const ForgetPassword = (props) => {

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
            setSuccess(`Consultez votre boîte mail: ${email} pour changer le mot de passe`);
            setEmail("");
            // redirect to login page after 5s :
            setTimeout(() => {
                props.history.push("/");
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
                        <NavLink className="home-link-nav" to="/login">Accueil</NavLink>
                        <NavLink className="about-link-nav" to="aboutNotConnected">A propos</NavLink>
                        <NavLink className="help-link-nav" to="help">Aide</NavLink>
                        <NavLink className="login-link-nav" to="login">Connexion</NavLink>
                        </div>
                    </div>
                </nav>
            </header>
            <h1 className='slogan'>Changer de mot de passe</h1>
            <span className='account-to-recup'><strong>Compte à récuperer</strong></span>
        <div className="content-forget">
                
                
            {messageSuccess}
            {messageError}
            <form onSubmit={handleSubmit}>
            <div className="inputForm-recuperation">
                <div>
                    <input onChange={e => {setEmail(e.target.value)}} value={email} type="email" id="email" autoComplete="off" required placeholder="Adresse email"/>
                </div>
               <button disabled={disabled}className='oui'>Récupérer</button>
            </div>
            </form>
        </div>
        </>
    )
};

export default ForgetPassword;
