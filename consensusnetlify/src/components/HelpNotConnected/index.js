import React from 'react';
import {NavLink} from 'react-router-dom';
import DropdownHelpNotConnected from '../DropdownHelpNotConnected';
import DropdownPwdHelp from '../MultiDropdownHelp/DropdownPwdHelp';
import DropdownAvatarQuestion from '../MultiDropdownHelp/DropdownAvatarQuestion';
import DropdownLangNumber from '../MultiDropdownHelp/DropdownLangNumber';
import DropdownSessionInfo from '../MultiDropdownHelp/DropdownSessionInfo';
import DropdownAHP from '../MultiDropdownHelp/DropdownAHP';

const HelpNotConnected = (props) => {

  return (
  <>
  <header className="header"> 
    <nav className="navbar-global">
        <div className="app-title">
            <h1 className='consensus-title'>ConsensUs</h1><style>@import url('https://fonts.googleapis.com/css2?family=Palanquin+Dark:wght@400;500;700&display=swap');</style>
            <div className="navbar-subtitle">
            <NavLink className="home-link-nav" to="/">Accueil</NavLink>
            <NavLink className="about-link-nav" to="aboutNotConnected">A propos</NavLink>
            <NavLink className="help-link-nav" to="helpNotConnected">Aide</NavLink>
            <NavLink className="login-link-nav" to="login">Connexion</NavLink>
            </div>
        </div>
    </nav>
  </header>

  <div className='subtitle-and-choose-lang'>
    <h1 className='slogan'>Aide</h1>
    <DropdownHelpNotConnected/>
  </div>

    {/* Questions parts */}
    <DropdownPwdHelp/>
    <DropdownSessionInfo/>
    <DropdownAvatarQuestion/>
    <DropdownLangNumber/>
    <DropdownAHP/>
  </>

  );
}

export default HelpNotConnected;
