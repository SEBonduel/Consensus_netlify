import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';
import "./newPwd.css";
import Logout from '../Logout';
import undefinedPic from '../../images/undefined.png';

const NewPdwFr = (props) => {

    const firebase = useContext(FirebaseContext);

    const [userSession] = useState(null);

    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = e => {
        e.preventDefault();
        firebase.passwordReset(email)
        .then(() => {
            setError(null);
            setSuccess(`Consultez votre boîte mail: ${email} pour changer le mot de passe`);
            setEmail("");
            // redirect to login page after 5s :
            setTimeout(() => {
                props.history.push("/profile");
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
     /*================= Avatar =====================*/
     useEffect(() => {
      userSession &&
      firebase.db.collection("users").doc(userSession.uid).get().then((doc) => {
          setUserData(doc.data());
        });
  }, [userSession])

  const [setUserData] = useState(null);
  const [displayChoose] = useState(false);

  const [preview, setPreview] = useState(undefined);

  useEffect(() => {
      if (userSession) {
          let unsubscribe2 = (userSession !== null) && firebase.db.collection("users").doc(userSession.uid).onSnapshot((doc => {
              if (!doc.exists) return;
              setPreview(doc.data().avatar);
          })); 
          return () => {
              unsubscribe2();
          }
      }
  }, [firebase.db, userSession])

  /*=========================================*/

    return userSession !== null ? 
        (<div className="loading"><div className="d-flex align-items-center">
        <strong>Loading ...</strong>
        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
      </div></div>)
    : 
( 
    <><header className="header">

    <nav className="navbar-global-connected">
      <div className="app-title-connected">
        <h1 className='consensus-title-connected'>ConsensUs</h1><style>@import url('https://fonts.googleapis.com/css2?family=Palanquin+Dark:wght@400;500;700&display=swap');</style>
        <div className="navbar-subtitle-connected">
          <NavLink className="home-link-nav-connected" to="login">Accueil</NavLink>
          <NavLink className="about-link-nav-connected" to="aboutConnected">A propos</NavLink>
          <NavLink className="help-link-nav-connected" to="help">Aide</NavLink>
          
          <Logout/>
          <div className='profil-pic'>
          {(displayChoose || preview === undefined) ? (
            <NavLink to="profile">
              <img
                id='profile-picture-nav'
                style={{height:'60px', width:'60px', margin: 'auto'}}
                src={undefinedPic}
                alt="UndefinedPic"
              />
            </NavLink>
          ) : (
            <NavLink to="profile">
              <img
                id='profile-picture-nav'
                style={{height:'60px', width:'60px', margin: 'auto'}}
                src={preview}
                alt="Preview"
              />
            </NavLink>
          )}
        
    </div>
        </div>
      </div>
    </nav>
  </header>
            <h1 className='slogan'>Changer de mot de passe</h1>
            <span className='account-to-recup'><strong>Entrez l'adresse email du compte dont vous voulez changer le mot de passe</strong></span>
        <div className="content-forget">
                
                
            {messageSuccess}
            {messageError}
            <form onSubmit={handleSubmit}>
            <div className="inputForm-recuperation">
                <div>
                    <input onChange={e => {setEmail(e.target.value)}} value={email} type="email" id="email" autoComplete="off" required placeholder="Adresse email"/>
                </div>
               <button disabled={disabled}className='oui'>Changer de mot de passe</button>
            </div>
            </form>
        </div>
        </>
    )
};

export default NewPdwFr;
