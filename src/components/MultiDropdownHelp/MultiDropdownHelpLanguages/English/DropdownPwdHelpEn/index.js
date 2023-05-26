import React, { useState } from 'react';
import downarrow from "../../../../../images/downarrow.png";
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

        <span className='Question'>Have you lost your password or do you want to change it?</span>
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
          <br/>If you have lost your password, go to the "Forgot Password" section on the registration page. You will need to provide your email address, and you will receive an email with a link to change your password. If you want to change it, go to the "Change Password" section on your profile page.<br/><br/>
         </span> 
        </div>
        
      )}
    </div>
  );
};

export default DropdownPwdHelp;
