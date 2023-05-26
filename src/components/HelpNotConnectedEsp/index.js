import React from 'react';
import { NavLink } from 'react-router-dom';
import DropdownHelpNotConnected from '../DropdownHelpNotConnected';
import DropdownPwdHelpEsp from '../MultiDropdownHelp/MultiDropdownHelpLanguages/Spanish/DropdownPwdHelpEsp';
import DropdownAvatarQuestionEsp from '../MultiDropdownHelp/MultiDropdownHelpLanguages/Spanish/DropdownAvatarQuestionEsp';
import DropdownLangNumberEsp from '../MultiDropdownHelp/MultiDropdownHelpLanguages/Spanish/DropdownLangNumberEsp';
import DropdownSessionInfoEsp from '../MultiDropdownHelp/MultiDropdownHelpLanguages/Spanish/DropdownSessionInfoEsp';
import DropdownAHPEsp from '../MultiDropdownHelp/MultiDropdownHelpLanguages/Spanish/DropdownAHPEsp';

const HelpNotConnectedEsp = (props) => {

  return (
  <>
  <header className="header">
        <nav className="navbar-global">
            <div className="app-title">
                <h1 className='consensus-title'>ConsensUs</h1><style>@import url('https://fonts.googleapis.com/css2?family=Palanquin+Dark:wght@400;500;700&display=swap');</style>
                <div className="navbar-subtitle">
                <NavLink className="home-link-nav" to="Esp">Inicio</NavLink>
                <NavLink className="about-link-nav" to="aboutNotConnectedEsp">Acerca de</NavLink>
                <NavLink className="help-link-nav" to="helpNotConnectedEsp">Ayuda</NavLink>
                <NavLink className="login-link-nav" to="loginEsp">Conexión</NavLink>
                </div>
            </div>
        </nav>
    </header>

  <div className='subtitle-and-choose-lang'>
    <h1 className='slogan'>Ayuda</h1>
    <DropdownHelpNotConnected/>
  </div>

    {/* Questions parts */}
    <DropdownPwdHelpEsp/>
    <DropdownSessionInfoEsp/>
    <DropdownAvatarQuestionEsp/>
    <DropdownLangNumberEsp/>
    <DropdownAHPEsp/>
  </>

  );
}

export default HelpNotConnectedEsp;
