import React, { useState } from 'react';
import downarrow from "../../../images/downarrow.png";
import "./dropdown.css";


const DropdownPwdHelp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isArrowDown, setIsArrowDown] = useState(true);

  const handleHeaderClick = () => {
    setIsOpen(!isOpen);
    setIsArrowDown(!isOpen);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-header2" onClick={handleHeaderClick}>

        <span className='Question'>Vous avez perdu votre mot de passe ou vous voulez le changer ?</span>
        <img
          className='downarrow2'
          src={downarrow}
          alt="dropdown arrow"
          style={{ transform: isArrowDown ? "rotate(360deg)" : "rotate(270deg)" }}
        />
      </div>
      {isOpen && (
        <div className="dropdown-list2" onClick={(e) => e.stopPropagation()}>
          <span className="response">
          <br/>Si vous avez perdu votre mot de passe, rendez-vous dans la section "mot de passe" oublié sur la page d'inscription, vous devrez renseigner 
          votre adresse mail et vous recevrez un mail avec un lien pour changer votre mot de passe.
          Si vous voulez le changer, rendez-vous dans la section "changer de mot de passe" sur la page de votre profil.<br/><br/>
         </span> 
        </div>
        
      )}
    </div>
  );
};

export default DropdownPwdHelp;
