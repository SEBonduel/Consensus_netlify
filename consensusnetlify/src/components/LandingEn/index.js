import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../Firebase';
import { useCurrentSession } from '../CurrentSessionContext';
import { NavLink } from 'react-router-dom';
import { usePage } from '../PageContext';
import '../Landing/landing.css';
import TextField from '@material-ui/core/TextField';
import logo_ERPI from "../../images/logo/ERPI.png";
import logo_ENSGSI from "../../images/logo/ENSGSI.png";
import logo_UNIV_LORRAINE from "../../images/logo/univLorraineLarge.png";
import LogoutEn from '../LogoutEn';
import undefinedPic from '../../images/undefined.png';
import DropdownHomeConnected from '../DropdownHomeConnected';




// Material UI :
/************************************************************* */
import Button from '@material-ui/core/Button';

/************************************************************* */


const LandingEn = (props) => {

    const [preview, setPreview] = useState(undefined);

    const firebase = useContext(FirebaseContext);

    const { setIdCurrentSession } = useCurrentSession();
 
    const { setCurrentPage } = usePage();

    const [userSession, setUserSession] = useState(null);

    const [code, setCode] = useState("");

    const [sessionData, setSessionData] = useState(null);

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


    // Session data recovery on firestore
    const handleClick = () => {
        firebase.db.collection("sessions").doc(code).get()
          .then((doc) => {
            if (doc.exists) {
              setSessionData(doc.data());
            } else {
              throw new Error("Document does not exist");
            }
          })
          .catch((error) => {
            console.error("Error getting document:", error);
            alert("Ce code de session n'existe pas");
          });
      }

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

    // check if session code is correct
    const isDisabled = ((code.length < 6) || (code.length > 6)) ? true : false;


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
                    <h1 className='slogan'>Team decision-making support</h1>
                    <DropdownHomeConnected/>
        </div>
      <div className="new-session-content">
          <span className='newsession'>Participate in a session</span>
          <div className="home-content">
              <span className='session-code-span'>Enter the session code</span>
              <div className='session-code-div-connected'>
              <TextField id="standard-basic" label="Session code" style={{ backgroundColor: '#ffffff', margin: '2em'}} onChange={(e) => setCode(e.target.value)} value={code} />
              </div>         
                      <div className='validatemargindiv'>  
                        <span className='validateButton2'>
                        <Button  onClick={handleClick} disabled={isDisabled} variant="contained" style={{ backgroundColor: '#2144bf' , margin: 'auto', marginBottom: '2em', borderRadius: '20px', width:'150px' }}>
                            Validate
                        </Button>
                        </span>
                      </div>
              <div className='create-or-my-session-list'>
              <button  className='create-session-button' onClick={() => props.history.push("/creationEn")}>Create a session</button>
              <button className='my-session-button' onClick={() => props.history.push("/historyEn")}>My sessions</button>
              </div>
          </div>
      </div>
        <h1 className='slogan'>What do ConsensUs ?</h1>

        <div className='what-make-consensus'>
          <span className='consensus-details'>ConsensUs is an innovative application designed to help groups reach a common agreement on controversial or difficult topics. It allows for the creation of online discussion sessions, where participants can express their opinions, share ideas, and discuss various aspects of a given subject. The application offers a user-friendly and intuitive interface that enables users to participate in real-time debates, provide feedback on specific questions, and vote on proposed suggestions.</span>
          <span className='consensus-details'>The ConsensUs application is designed to be easy to use and accessible to everyone. It offers a range of advanced features, such as the ability to create private sessions and track the progress of discussions in real-time.</span>
          <span className='consensus-details'>In summary, ConsensUs is a user-friendly and innovative application that allows groups to discuss controversial topics and find common solutions. It offers a range of advanced features that make the discussion process easier and more efficient. Whether you are a business leader, a teacher, or simply a concerned citizen looking to contribute to the resolution of complex problems, ConsensUs can help you achieve your goals in collaborative decision-making.</span>
        </div>

        <h1 className='slogan'>Summary</h1>

        <div className='summary'>
            <div className='create-summary'>    <h2 className='summary-title'>CREATE</h2>    <span className='summary-span'>Create a new session to help your team make a decision.</span></div>
            <div className='participate-summary'>    <h2 className='summary-title'>PARTICIPATE</h2>    <span className='summary-span'>Participate in a session and encourage members of your team to participate.</span></div>
            <div className='consult-summary'><h2 className='summary-title'>CONSULT</h2>    <span className='summary-span'>Go back to your past sessions to analyze the results.</span></div>
        </div>

        <div className='logo-footer'>
            <img className='logo-footer-erpi' src={logo_ERPI} alt="logo"/>
            <img className='logo-footer-ensgsi' src={logo_ENSGSI} alt="logo"/>
            <img className='logo-footer-univlorraine' src={logo_UNIV_LORRAINE} alt="logo"/>
        </div>

        
      </>
    
    
    );

}

export default LandingEn;
