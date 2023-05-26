import React, {useState, useContext, useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';
import "../NewPwdFr/newPwd.css";
import LogoutEn from '../LogoutEn';
import undefinedPic from '../../images/undefined.png';


const NewPdwEn = (props) => {

    const firebase = useContext(FirebaseContext);

    const [userSession] = useState(null);

    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    /*================= Avatar =====================*/
    const [code] = useState("");

    const [sessionData] = useState(null);
    useEffect(() => {
        userSession &&
        firebase.db.collection("users").doc(userSession.uid).get().then((doc) => {
            setUserData(doc.data());
          });
    }, [userSession])

    const [userData, setUserData] = useState(null);
    const [displayChoose] = useState(false);

    const [preview, setPreview] = useState(undefined);

    useEffect(() => {
      if (sessionData && userData && !sessionData.startSession) {
          let userSessionsUpdated = userData.userSessions;
          if (!userSessionsUpdated.includes(code)) userSessionsUpdated.push(code);
          firebase.saveUserSession(userSession.uid).set({userSessions: userSessionsUpdated}, {merge: true});
          let participantsUpdated = {...sessionData.participants, [userSession.uid]: {userPseudo: userData.pseudo, userGroup: "", userRole: "", userStage: 0, validatedStage: false, criteriaWeight: sessionData.criteria.map(crit => {return {label: crit.label, weight: 0}})}};
          firebase.saveSession(code).set({participants: participantsUpdated}, {merge: true});
          firebase.saveParticipants(code, userSession.uid).set({step: 'R', uid: userSession.uid, userPseudo: userData.pseudo, userGroup: "", userRole: "", userStage: 0, endNego: false, consensus: false, noconsensus: false, validatedStage: null, criteriaWeight: sessionData.criteria.map(crit => {return {label: crit.label, weight: 0}})});
          props.history.push("/recap");
      }
  }, [sessionData, userData])

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

    const handleSubmit = e => {
        e.preventDefault();
        firebase.passwordReset(email)
        .then(() => {
            setError(null);
            setSuccess(`Consultez votre boîte mail: ${email} pour changer le mot de passe`);
            setEmail("");
            // redirect to login page after 5s :
            setTimeout(() => {
                props.history.push("/profileEn");
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

    <nav className="navbar-global-connected">
      <div className="app-title-connected">
        <h1 className='consensus-title-connected'>ConsensUs</h1><style>@import url('https://fonts.googleapis.com/css2?family=Palanquin+Dark:wght@400;500;700&display=swap');</style>
        <div className="navbar-subtitle-connected">
              <NavLink className="home-link-nav-connected" to="loginEn">Home</NavLink>
              <NavLink className="about-link-nav-connected" to="aboutConnectedEn">About</NavLink>
              <NavLink className="help-link-nav-connected" to="helpConnectedEn">Help</NavLink>
              
              <LogoutEn/>
              <div className='profil-pic'>
              {(displayChoose || preview === undefined) ? (
                <NavLink to="profileEn">
                  <img
                    id='profile-picture-nav'
                    style={{height:'60px', width:'60px', margin: 'auto'}}
                    src={undefinedPic}
                    alt="UndefinedPic"
                  />
                </NavLink>
              ) : (
                <NavLink to="profileEn">
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
            <h1 className='slogan'>Change your password</h1>
            <span className='account-to-recup'><strong>Enter the email address of the account for which you want to change the password</strong></span>
        <div className="content-forget">
                
                
            {messageSuccess}
            {messageError}
            <form onSubmit={handleSubmit}>
            <div className="inputForm-recuperation">
                <div>
                    <input onChange={e => {setEmail(e.target.value)}} value={email} type="email" id="email" autoComplete="off" required placeholder="Email address"/>
                </div>
               <button disabled={disabled}className='oui'>Change your password</button>
            </div>
            </form>
        </div>
        </>
    )
};

export default NewPdwEn;
