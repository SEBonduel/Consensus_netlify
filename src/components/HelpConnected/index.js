import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../Firebase';
import { useCurrentSession } from '../CurrentSessionContext';
import { NavLink } from 'react-router-dom';
import { usePage } from '../PageContext';
import Logout from '../Logout';
import undefinedPic from '../../images/undefined.png';
import DropdownHelpConnected from '../DropdownHelpConnected';
import DropdownPwdHelp from '../MultiDropdownHelp/DropdownPwdHelp';
import DropdownAvatarQuestion from '../MultiDropdownHelp/DropdownAvatarQuestion';
import DropdownLangNumber from '../MultiDropdownHelp/DropdownLangNumber';
import DropdownSessionInfo from '../MultiDropdownHelp/DropdownSessionInfo';
import DropdownAHP from '../MultiDropdownHelp/DropdownAHP';

const HelpConnected = (props) => {

    const [preview, setPreview] = useState(undefined);


    const firebase = useContext(FirebaseContext);

    const { setIdCurrentSession } = useCurrentSession();
 
    const { setCurrentPage } = usePage();

    const [userSession, setUserSession] = useState(null);

    const [code] = useState("");

    const [sessionData] = useState(null);

    const [userData, setUserData] = useState(null);

    const [displayChoose] = useState(false);

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


    // User data recovery on firestore
    useEffect(() => {
        userSession &&
        firebase.db.collection("users").doc(userSession.uid).get().then((doc) => {
            setUserData(doc.data());
          });
    }, [userSession])


    // Redirect to recap page 
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

    return userSession === null ? 
    (<div>Loading</div>)
    : 
    (<><header className="header">

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

      <div className='subtitle-and-choose-lang'>
                    <h1 className='slogan'>Aide</h1>
                    <DropdownHelpConnected/>
        </div>

        {/* composants permettant un menu déroulant question par question */}
        <DropdownPwdHelp/>
        <DropdownSessionInfo/>
        <DropdownAvatarQuestion/>
        <DropdownLangNumber/>
        <DropdownAHP/>


        
      </>
    
    
    );

}

export default HelpConnected;
