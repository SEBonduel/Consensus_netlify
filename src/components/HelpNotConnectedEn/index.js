import React from 'react';
import { NavLink } from 'react-router-dom';
import DropdownHelpNotConnected from '../DropdownHelpNotConnected';
import DropdownPwdHelpEn from '../MultiDropdownHelp/MultiDropdownHelpLanguages/English/DropdownPwdHelpEn';
import DropdownAvatarQuestionEn from '../MultiDropdownHelp/MultiDropdownHelpLanguages/English/DropdownAvatarQuestionEn';
import DropdownLangNumberEn from '../MultiDropdownHelp/MultiDropdownHelpLanguages/English/DropdownLangNumberEn';
import DropdownSessionInfoEn from '../MultiDropdownHelp/MultiDropdownHelpLanguages/English/DropdownSessionInfoEn';
import DropdownAHPEn from '../MultiDropdownHelp/MultiDropdownHelpLanguages/English/DropdownAHPEn';

const HelpNotConnectedEn = (props) => {

  return (
  <>
  <header className="header"> 
    <nav className="navbar-global">
        <div className="app-title">
            <h1 className='consensus-title'>ConsensUs</h1><style>@import url('https://fonts.googleapis.com/css2?family=Palanquin+Dark:wght@400;500;700&display=swap');</style>
            <div className="navbar-subtitle">
            <NavLink className="home-link-nav" to="/">Home</NavLink>
            <NavLink className="about-link-nav" to="aboutNotConnected">About</NavLink>
            <NavLink className="help-link-nav" to="helpNotConnected">Help</NavLink>
            <NavLink className="login-link-nav" to="login">Login</NavLink>
            </div>
        </div>
    </nav>
  </header>

  <div className='subtitle-and-choose-lang'>
    <h1 className='slogan'>Help</h1>
    <DropdownHelpNotConnected/>
  </div>

    {/* Questions parts */}
    <DropdownPwdHelpEn/>
    <DropdownSessionInfoEn/>
    <DropdownAvatarQuestionEn/>
    <DropdownLangNumberEn/>
    <DropdownAHPEn/>
  </>

  );
}

export default HelpNotConnectedEn;
