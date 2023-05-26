import React, { useState } from 'react';
import downarrow from "../../../../../images/downarrow.png";
import "./dropdown.css";


const DropdownLangNumber = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isArrowDown, setIsArrowDown] = useState(true);

  const handleHeaderClick = () => {
    setIsOpen(!isOpen);
    setIsArrowDown(!isOpen);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-header2" onClick={handleHeaderClick}>

        <span className='Question'>In how many languages is the application available?</span>
        <img
          className='downarrow2'
          src={downarrow}
          alt="dropdown arrow"
          style={{ transform: isArrowDown ? "rotate(360deg)" : "rotate(270deg)" }}
        />
      </div>
      {isOpen && (
        <div className="dropdown-list2" onClick={(e) => e.stopPropagation()}>
          <span className="response"><br/> Currently, the application is available in 3 languages: French, Spanish, and English.<br/><br/></span>
        </div>
        
      )}
    </div>
  );
};

export default DropdownLangNumber;
