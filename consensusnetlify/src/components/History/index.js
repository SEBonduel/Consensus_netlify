import React, {useContext, useState, useEffect} from 'react';
import {FirebaseContext} from '../Firebase';
import { useCurrentSession } from '../CurrentSessionContext';
import SavedSession from '../SavedSession';
import { usePage } from '../PageContext';
import { useHelp } from '../HelpContext';
import explication from '../../images/historyHelp.png';
import { NavLink } from 'react-router-dom';
import undefinedPic from '../../images/undefined.png';
import Logout from '../Logout';
import "./history.css"; 
import DropdownHistory from '../DropdownHistory'; 


const History = (props) => {


    const firebase = useContext(FirebaseContext);

    const [preview, setPreview] = useState(undefined);

    const { setCurrentHelp } = useHelp();

    const [userSession, setUserSession] = useState(null);

    const { setIdCurrentSession } = useCurrentSession();

    const { setCurrentPage } = usePage();

    const [owner, setOwner] = useState("");

    const [checked, setChecked] = useState(false);

    const [idSession, setIdSession] = useState("");

    const [displayChoose] = useState(false);

    const [code] = useState("");

    const [sessionData] = useState(null);



    const [userData, setUserData] = useState({
        userSessions: []
    });
  
      useEffect(() => {
          setIdCurrentSession(false);
          setCurrentPage("global");
          // setCurrentHelp(explication);
          let listener = firebase.auth.onAuthStateChanged(user => {
              user ? setUserSession(user) : props.history.push("/");
          })
          return () => {
              listener()
          };
      }, [])

    useEffect(() => {
        setIdCurrentSession(false);
        setCurrentPage("global2");
        setCurrentHelp(explication);
        let listener = firebase.auth.onAuthStateChanged(user => {
            user ? setUserSession(user) : props.history.push("/");
        })
        return () => {
            listener()
        };
    }, [])


    // User data recovery on firestore
    useEffect(() => {
        userSession &&
        firebase.db.collection("users").doc(userSession.uid).get().then((doc) => {
            setUserData(doc.data());
          });
    }, [userSession])

    // session ID recovery :
    const handleClick = (idS) => {
        let userSessionsUpdated = userData.userSessions.filter(s => (s !== idS) && s);
        userSessionsUpdated.push(idS);
        firebase.saveUserSession(userSession.uid).set({userSessions: userSessionsUpdated}, {merge: true});
        firebase.db.collection('sessions').doc(idS).get().then((doc) => {
            setChecked(doc.data().checked);
            setOwner(doc.data().owner);
        });
        setIdSession(idS);
    }

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

    // Redirect to good page
    useEffect(() => {
        if (owner !== "") {
            if (userSession.uid === owner && !checked) {
                props.history.push("/recap");
            } else {
                let userStep = '';
                firebase.db.collection(`sessions/${idSession}/participants`).doc(userSession.uid).get().then((doc) => {
                    userStep = doc.data().step;
                });
                if (userStep === 'R') {
                    props.history.push("/recap");
                } else if (userStep === 'D') {
                    props.history.push("/individualDecision");
                } else if (userStep === 'S') {
                    props.history.push("/selection");
                } else if (userStep === 'N') {
                    props.history.push("/negociation");
                } else {
                    props.history.push("/consensus");
                }
            }
        }
    }, [owner])

    return userSession === null ? 
        (<div>Loading</div>)
    : 
    <><header className="header">

    <nav className="navbar-global-connected">
      <div className="app-title-connected">
        <h1 className='consensus-title-connected'>ConsensUs</h1><style>@import url('https://fonts.googleapis.com/css2?family=Palanquin+Dark:wght@400;500;700&display=swap');</style>
        <div className="navbar-subtitle-connected">
          <NavLink className="home-link-nav-connected" to="login">Accueil</NavLink>
          <NavLink className="about-link-nav-connected" to="aboutConnected">A propos</NavLink>
          <NavLink className="help-link-nav-connected" to="helpConnected">Aide</NavLink>
          
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
        <div className="history-content">
        <div className='subtitle-and-choose-lang'>
                    <h1 className='slogan'>Mes sessions</h1>
                    <DropdownHistory/>
        </div>
            <div className='past-session-list'>
                {userData.userSessions.map((session) => (
                    <div className='past-session'>
                        <SavedSession session={session} handleClick={handleClick} />
                    </div>
                ))}
            </div>
            </div>
 
        </>;
}

export default History;
