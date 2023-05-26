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
import LogoutEsp from '../LogoutEsp';
import undefinedPic from '../../images/undefined.png';
import DropdownHomeConnected from '../DropdownHomeConnected';





// Material UI :
/************************************************************* */
import Button from '@material-ui/core/Button';

/************************************************************* */


const LandingEsp = (props) => {

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
              <NavLink className="home-link-nav-connected" to="loginEsp">Inicio</NavLink>
              <NavLink className="about-link-nav-connected" to="aboutConnectedEsp">Acerca de</NavLink>
              <NavLink className="help-link-nav-connected" to="helpConnectedEsp">Ayuda</NavLink>
              
              <LogoutEsp/>
              <div className='profil-pic'>
              {(displayChoose || preview === undefined) ? (
                <NavLink to="profileEsp">
                  <img
                    id='profile-picture-nav'
                    style={{height:'60px', width:'60px', margin: 'auto'}}
                    src={undefinedPic}
                    alt="UndefinedPic"
                  />
                </NavLink>
              ) : (
                <NavLink to="profileEsp">
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
                    <h1 className='slogan'>Ayuda en la toma de decisiones en equipo</h1>
                    <DropdownHomeConnected/>
        </div>

      <div className="new-session-content">
          <span className='newsession'>Participar en una nueva sesión</span>
          <div className="home-content">
              <span className='session-code-span'>Introducir el código de la sesión</span>
              <div className='session-code-div-connected'>
              <TextField id="standard-basic" label="Código de sesión" style={{ backgroundColor: '#ffffff', margin: '2em'}} onChange={(e) => setCode(e.target.value)} value={code} />
              </div>         
                      <div className='validatemargindiv'>  
                        <span className='validateButton2'>
                        <Button  onClick={handleClick} disabled={isDisabled} variant="contained" style={{ backgroundColor: '#2144bf' , margin: 'auto', marginBottom: '2em', borderRadius: '20px', width:'150px' }}>
                            Validar
                        </Button>
                        </span>
                      </div>
              <div className='create-or-my-session-list'>
              <button  className='create-session-button' onClick={() => props.history.push("/creationEsp")}>Crear una sesión</button>
              <button className='my-session-button' onClick={() => props.history.push("/historyEsp")}>Mis sesiones</button>
              </div>
          </div>
      </div>
        <h1 className='slogan'>¿Qué está haciendo ConsensUs?</h1>

        <div className='what-make-consensus'>
          <span className='consensus-details'>ConsensUs es una aplicación innovadora diseñada para ayudar a los grupos a encontrar un acuerdo común sobre temas controvertidos o difíciles. Permite crear sesiones de discusión en línea, donde los participantes pueden expresar sus opiniones, compartir ideas y discutir los diferentes aspectos de un tema dado. La aplicación ofrece una interfaz amigable e intuitiva que permite a los usuarios participar en debates en tiempo real, dar su opinión sobre preguntas específicas y votar por las propuestas presentadas.</span>
          <span className='consensus-details'>La aplicación ConsensUs está diseñada para ser fácil de usar y accesible para todos. Ofrece una variedad de características avanzadas, como la capacidad de crear sesiones privadas y seguir el progreso de las discusiones en tiempo real.</span>
          <span className='consensus-details'>En resumen, ConsensUs es una aplicación amigable e innovadora que permite a los grupos discutir temas controvertidos y encontrar soluciones comunes. Ofrece una variedad de características avanzadas que hacen que el proceso de discusión sea más fácil y efectivo. Ya sea que seas un líder empresarial, un profesor o simplemente un ciudadano preocupado por contribuir a la resolución de problemas complejos, ConsensUs puede ayudarte a alcanzar tus objetivos en cuanto a la toma de decisiones colaborativas.</span>
        </div>

        <h1 className='slogan'>Resumen</h1>

        <div className='summary'>
            <div className='create-summary'>    <h2 className='summary-title'>CREACIÓN</h2>    <span className='summary-span'>Cree una nueva sesión para ayudar a su equipo a tomar una decisión</span></div>
            <div className='participate-summary'>    <h2 className='summary-title'>PARTICIPACIÓN</h2>    <span className='summary-span'>Participe en una sesión y haga que los miembros de su equipo participen.</span></div>
            <div className='consult-summary'><h2 className='summary-title'>CONSULTA</h2>    <span className='summary-span'>Revise sus sesiones anteriores para analizar los resultados.</span></div>
        </div>

        <div className='logo-footer'>
            <img className='logo-footer-erpi' src={logo_ERPI} alt="logo"/>
            <img className='logo-footer-ensgsi' src={logo_ENSGSI} alt="logo"/>
            <img className='logo-footer-univlorraine' src={logo_UNIV_LORRAINE} alt="logo"/>
        </div>
      </>
    );

}

export default LandingEsp;
