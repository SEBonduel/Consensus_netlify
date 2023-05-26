import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../Firebase';
import { useCurrentSession } from '../CurrentSessionContext';
import { NavLink } from 'react-router-dom';
import { usePage } from '../PageContext';
import './landing.css';
import TextField from '@material-ui/core/TextField';
import logo_ERPI from "../../images/logo/ERPI.png";
import logo_ENSGSI from "../../images/logo/ENSGSI.png";
import logo_UNIV_LORRAINE from "../../images/logo/univLorraineLarge.png";
import Logout from '../Logout';
import undefinedPic from '../../images/undefined.png';
import DropdownHomeConnected from '../DropdownHomeConnected';





// Material UI :
/************************************************************* */
import Button from '@material-ui/core/Button';


/************************************************************* */


const Landing = (props) => {

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

      <div className='subtitle-and-choose-lang'>
                    <h1 className='slogan'>Aide à la prise de décision en équipe</h1>
                    <DropdownHomeConnected/>
        </div>
      <div className="new-session-content">
          <span className='newsession'>Participer à une session</span>
          <div className="home-content">
              <span className='session-code-span'>Entrer le code de la session</span>
              <div className='session-code-div-connected'>
              <TextField id="standard-basic" label="Code de la session" style={{ backgroundColor: '#ffffff', margin: '2em'}} onChange={(e) => setCode(e.target.value)} value={code} />
              </div>         
                      <div className='validatemargindiv'>  
                        <span className='validateButton2'>
                        <Button  onClick={handleClick} disabled={isDisabled} variant="contained" style={{ backgroundColor: '#2144bf' , margin: 'auto', marginBottom: '2em', borderRadius: '20px', width:'150px' }}>
                            Valider
                        </Button>
                        </span>
                      </div>
              <div className='create-or-my-session-list'>
              <button  className='create-session-button' onClick={() => props.history.push("/creation")}>Créer une session</button>
              <button className='my-session-button' onClick={() => props.history.push("/history")}>Mes sessions</button>
              </div>
          </div>
      </div>
        <h1 className='slogan'>Que fait ConsensUs ?</h1>

        <div className='what-make-consensus'>
          <span className='consensus-details'>ConsensUs est une application innovante conçue pour aider les groupes à trouver un accord commun sur des sujets controversés ou difficiles. Elle permet de créer des sessions de discussion en ligne, où les participants peuvent exprimer leurs opinions, partager des idées et discuter des différents aspects d'un sujet donné. L'application offre une interface conviviale et intuitive qui permet aux utilisateurs de participer aux débats en temps réel, de donner leur avis sur des questions spécifiques et de voter pour les propositions proposées.</span>
          <span className='consensus-details'>L'application ConsensUs est conçue pour être facile à utiliser et accessible à tous. Elle offre une gamme de fonctionnalités avancées, telles que la possibilité de créer des sessions privées et de suivre l'avancement des discussions en temps réel.</span>
          <span className='consensus-details'>En résumé, ConsensUs est une application conviviale et innovante qui permet aux groupes de discuter des sujets controversés et de trouver des solutions communes. Elle offre une gamme de fonctionnalités avancées qui rendent le processus de discussion plus facile et plus efficace. Que vous soyez un leader d'entreprise, un professeur ou simplement un citoyen soucieux de contribuer à la résolution de problèmes complexes, ConsensUs peut vous aider à atteindre vos objectifs en matière de prise de décision collaborative.</span>
        </div>

        <h1 className='slogan'>En résumé</h1>

        <div className='summary'>
            <div className='create-summary'>    <h2 className='summary-title'>CRÉATION</h2>    <span className='summary-span'>Crée une nouvelle session pour aider ton équipe à prendre une décision.</span></div>
            <div className='participate-summary'>    <h2 className='summary-title'>PARTICIPATION</h2>    <span className='summary-span'>Participe à une session et fais participer les membres de ton équipe</span></div>
            <div className='consult-summary'><h2 className='summary-title'>CONSULTATION</h2>    <span className='summary-span'>Reviens sur tes sessions passées pour analyser les résultats</span></div>
        </div>

        <div className='logo-footer'>
            <img className='logo-footer-erpi' src={logo_ERPI} alt="logo"/>
            <img className='logo-footer-ensgsi' src={logo_ENSGSI} alt="logo"/>
            <img className='logo-footer-univlorraine' src={logo_UNIV_LORRAINE} alt="logo"/>
        </div>

        
      </>
    
    
    );

}

export default Landing;
