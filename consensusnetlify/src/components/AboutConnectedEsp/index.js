import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../Firebase';
import { useCurrentSession } from '../CurrentSessionContext';
import { NavLink } from 'react-router-dom';
import { usePage } from '../PageContext';
import LogoutEsp from '../LogoutEsp';
import undefinedPic from '../../images/undefined.png';
import DropdownAboutConnected from '../DropdownAboutConnected';

const AboutConnectedEsp = (props) => {

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
      <div className="subtitle-and-choose-lang">
      <h1 className='slogan'>Acerca de</h1>
      <DropdownAboutConnected/>         
      </div>

  <div className="about-project">
    <span className='about-project-title'><strong>El proyecto</strong></span>
    <div className='about-project-content'>cnhqjzekbfjqklnjk</div>
  </div>

  <div className="about-ERPI">
    <span className='about-ERPI-title'><strong>laboratorio ERPI</strong></span>
    <div className='about-ERPI-content'>
El laboratorio ERPI (Equipo de Investigación sobre Procesos Innovativos) es un laboratorio de investigación ubicado en la ENSGSI (Escuela Nacional Superior en Ingeniería de Sistemas e Innovación) en Nancy, Francia. El laboratorio ERPI se enfoca en procesos innovativos, ingeniería de la innovación y gestión de la innovación. Las investigaciones llevadas a cabo en este laboratorio se centran en el análisis de los procesos de innovación en diversos sectores industriales, como la salud, la energía, la aeroespacial y la automotriz, así como en el desarrollo de metodologías y herramientas para mejorar la eficacia y eficiencia de los procesos de innovación. Los investigadores del laboratorio ERPI trabajan en estrecha colaboración con empresas, universidades e instituciones públicas para llevar a cabo proyectos de investigación aplicada y transferir los resultados de investigación a la industria. El laboratorio ERPI es reconocido por su experiencia en el campo de la ingeniería de la innovación y es considerado un líder.</div>
  </div>

  <div className="about-ENSGSI">
    <span className='about-ENSGSI-title'><strong>ENSGSI</strong></span>
    <div className='about-ENSGSI-content'>
La Escuela Nacional Superior de Ingeniería de Sistemas e Innovación (ENSGSI) es una escuela de ingeniería ubicada en Nancy, Francia. La ENSGSI ofrece una formación multidisciplinaria centrada en la innovación y la creatividad, con especializaciones en diseño y gestión de proyectos, sistemas industriales, sistemas de información, logística y cadena de suministro, y energías renovables. La escuela tiene como objetivo formar ingenieros capaces de comprender los desafíos tecnológicos, económicos y sociales actuales y proponer soluciones innovadoras para enfrentar los desafíos del futuro. La ENSGSI se centra en la práctica y la experiencia profesional, con pasantías y proyectos en empresas desde el primer año de formación. La ENSGSI es parte de la Universidad de Lorraine y está acreditada por la Comisión de Títulos de Ingeniería (CTI). Cuenta con aproximadamente 800 estudiantes y 80 profesores e investigadores, y es reconocida por su excelencia académica y fuerte orientación profesional.</div>
  </div>

  <div className="about-univ">
    <span className='about-univ-title'><strong>La Universidad de Lorena</strong></span>
    <div className='about-univ-content'>La Universidad de Lorena es una universidad pluridisciplinaria francesa ubicada en la región de Gran Este. Fue creada en 2012 por la fusión de cuatro establecimientos universitarios. La universidad cuenta hoy con más de 58.000 estudiantes y ofrece formaciones en todas las áreas, desde la medicina hasta las ciencias humanas, pasando por las ciencias de la ingeniería y las ciencias exactas. La Universidad de Lorena es reconocida por su excelencia académica, su fuerte orientación profesional y sus colaboraciones con la industria. También está comprometida con la investigación, con más de 80 laboratorios y centros de investigación, y participa en proyectos internacionales para fomentar la movilidad estudiantil y la cooperación científica.</div>
  </div>

  <div className="about-team">
    <span className='about-team-title'><strong>Equipo</strong></span>
    <div className='about-team-content'>frhuukijsrfoliuhrqlhi</div>
  </div>
  </>)
}

export default AboutConnectedEsp;