import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import "./aboutNotConnected.css";
import DropdownAboutNotConnected from '../DropdownAboutNotConnected';

const AboutNotConnectedEsp = (props) => {

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
                <NavLink className="home-link-nav" to="/esp">Inicio</NavLink>
                <NavLink className="about-link-nav" to="aboutNotConnectedEsp">Acerca de</NavLink>
                <NavLink className="help-link-nav" to="helpNotConnectedEsp">Ayuda</NavLink>
                <NavLink className="login-link-nav" to="loginEsp">Conexión</NavLink>
                </div>
            </div>
        </nav>
    </header>
    <div className="subtitle-and-choose-lang">
      <h1 className='slogan'>Acerca de</h1>
      <DropdownAboutNotConnected/>         
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
  </div>
    )
}

export default AboutNotConnectedEsp;
