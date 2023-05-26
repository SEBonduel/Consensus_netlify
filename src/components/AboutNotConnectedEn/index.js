import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import "./aboutNotConnected.css";
import DropdownAboutNotConnected from '../DropdownAboutNotConnected';

const AboutNotConnectedEn = (props) => {

    const [userSession] = useState(null);

    const [email] = useState("");

    const [password] = useState("");

    const [btn, setBtn] = useState(false);

    useEffect(() => {
        if (password.length > 5 && email !== ""){
            setBtn(true);
        } else if (btn) {
            setBtn(false);
        }
    }, [password, email, btn])

    return userSession !== null ? 
        (<div className="loading"><div className="d-flex align-items-center">
        <strong>Loading ...</strong>
        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
      </div></div>)
    : 
    (<div className="about-connected-content">          
    <header className="header">
        
        <nav className="navbar-global">
            <div className="app-title">
                <h1 className='consensus-title'>ConsensUs</h1><style>@import url('https://fonts.googleapis.com/css2?family=Palanquin+Dark:wght@400;500;700&display=swap');</style>
                <div className="navbar-subtitle">
                <NavLink className="home-link-nav" to="/En">Home</NavLink>
                <NavLink className="about-link-nav" to="aboutNotConnectedEn">About</NavLink>
                <NavLink className="help-link-nav" to="helpNotConnectedEn">Help</NavLink>
                <NavLink className="login-link-nav" to="loginEn">Login</NavLink>
                </div>
            </div>
        </nav>
    </header>
    <div className='subtitle-and-choose-lang'>
      <h1 className='slogan'>About</h1>
      <DropdownAboutNotConnected/>
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
</div>
    )
}

export default AboutNotConnectedEn;
