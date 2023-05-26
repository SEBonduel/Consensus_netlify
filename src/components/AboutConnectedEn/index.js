import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../Firebase';
import { useCurrentSession } from '../CurrentSessionContext';
import { NavLink } from 'react-router-dom';
import { usePage } from '../PageContext';
import LogoutEn from '../LogoutEn';
import undefinedPic from '../../images/undefined.png';
import DropdownAboutConnected from '../DropdownAboutConnected';


const AboutConnectedEn = (props) => {

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
      <h1 className='slogan'>About</h1>
      <DropdownAboutConnected/>
      </div>
  <div className="about-project">
    <span className='about-project-title'><strong>Project</strong></span>
    <div className='about-project-content'>cnhqjzekbfjqklnjk</div>
  </div>

  <div className="about-ERPI">
    <span className='about-ERPI-title'><strong>ERPI Laboratory</strong></span>
    <div className='about-ERPI-content'>The ERPI (Innovative Processes Research Team) Laboratory is a research laboratory located at ENSGSI (National School of Engineering in Systems and Innovation) in Nancy, France. The ERPI laboratory focuses on innovative processes, innovation engineering, and innovation management. Research conducted in this laboratory is centered on analyzing innovation processes in various industrial sectors such as healthcare, energy, aerospace, and automotive, as well as developing methodologies and tools to improve the efficiency and effectiveness of innovation processes. Researchers at the ERPI laboratory work closely with companies, universities, and public institutions to conduct applied research projects and transfer research results to industry. The ERPI laboratory is recognized for its expertise in innovation engineering and is considered a leader in the field.</div>
  </div>

  <div className="about-ENSGSI">
    <span className='about-ENSGSI-title'><strong>ENSGSI</strong></span>
    <div className='about-ENSGSI-content'>The National School of Engineering in Systems and Innovation (ENSGSI) is a French engineering school located in Nancy. ENSGSI offers a multidisciplinary education focused on innovation and creativity, with specializations in project design and management, industrial systems, information systems, logistics and supply chain, and renewable energy. The school aims to train engineers capable of understanding current technological, economic, and societal challenges and proposing innovative solutions to address the challenges of tomorrow. ENSGSI emphasizes practical experience and professional training, with internships and business projects starting in the first year of education. ENSGSI is part of the University of Lorraine and is accredited by the Commission des Titres d'Ingénieur (CTI). It has approximately 800 students and 80 faculty members, and is recognized for its academic excellence and strong professional orientation.</div>
  </div>

  <div className="about-univ">
    <span className='about-univ-title'><strong>The University of Lorraine</strong></span>
    <div className='about-univ-content'>The University of Lorraine is a French multidisciplinary university located in the Grand Est region. It was created in 2012 by the merger of four university institutions. The university currently has more than 58,000 students and offers courses in all fields, ranging from medicine to humanities, engineering and exact sciences. The University of Lorraine is recognized for its academic excellence, strong professional orientation, and partnerships with industry. It is also committed to research, with over 80 research laboratories and centers, and participates in international projects to promote student mobility and scientific cooperation.</div>
  </div>

  <div className="about-team">
    <span className='about-team-title'><strong>Team</strong></span>
    <div className='about-team-content'>frhuukijsrfoliuhrqlhi</div>
  </div>
  </>)
}

export default AboutConnectedEn;