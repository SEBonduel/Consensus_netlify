import React, { useState } from 'react';
import downarrow from "../../../../../images/downarrow.png";
import "./dropdown.css";


const DropdownLangNumberEsp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isArrowDown, setIsArrowDown] = useState(true);

  const handleHeaderClick = () => {
    setIsOpen(!isOpen);
    setIsArrowDown(!isOpen);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-header2" onClick={handleHeaderClick}>

        <span className='Question'>¿En cuántos idiomas está disponible la aplicación?</span>
        <img
          className='downarrow2'
          src={downarrow}
          alt="dropdown arrow"
          style={{ transform: isArrowDown ? "rotate(360deg)" : "rotate(270deg)" }}
        />
      </div>
      {isOpen && (
        <div className="dropdown-list2" onClick={(e) => e.stopPropagation()}>
          <span className="response"><br/> Por el momento, la aplicación está disponible en 3 idiomas: francés, español e inglés.<br/><br/></span>
        </div>
        
      )}
    </div>
  );
};

export default DropdownLangNumberEsp;
