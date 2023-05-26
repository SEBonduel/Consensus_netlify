import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../Firebase';
import { useCurrentSession } from '../CurrentSessionContext';
import { NavLink } from 'react-router-dom';
import { usePage } from '../PageContext';
import './help.css';
import LogoutEn from '../LogoutEn';
import undefinedPic from '../../images/undefined.png';
import DropdownHelpConnected from '../DropdownHelpConnected';
import DropdownPwdHelpEn from '../MultiDropdownHelp/MultiDropdownHelpLanguages/English/DropdownPwdHelpEn';
import DropdownAvatarQuestionEn from '../MultiDropdownHelp/MultiDropdownHelpLanguages/English/DropdownAvatarQuestionEn';
import DropdownLangNumberEn from '../MultiDropdownHelp/MultiDropdownHelpLanguages/English/DropdownLangNumberEn';
import DropdownSessionInfoEn from '../MultiDropdownHelp/MultiDropdownHelpLanguages/English/DropdownSessionInfoEn';
import DropdownAHPEn from '../MultiDropdownHelp/MultiDropdownHelpLanguages/English/DropdownAHPEn';

const HelpConnectedEn = (props) => {

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

      <div className='subtitle-and-choose-lang'>
                    <h1 className='slogan'>Help</h1>
                    <DropdownHelpConnected/>
        </div>

        {/* composants permettant un menu déroulant question par question */}
        <DropdownPwdHelpEn/>
        <DropdownSessionInfoEn/>
        <DropdownAvatarQuestionEn/>
        <DropdownLangNumberEn/>
        <DropdownAHPEn/>


        
      </>
    
    
    );

}

export default HelpConnectedEn;
