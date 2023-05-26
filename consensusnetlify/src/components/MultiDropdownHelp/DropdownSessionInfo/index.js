import React, { useState } from 'react';
import downarrow from "../../../images/downarrow.png";
import "./dropdown.css";


const DropdownSessionInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isArrowDown, setIsArrowDown] = useState(true);

  const handleHeaderClick = () => {
    setIsOpen(!isOpen);
    setIsArrowDown(!isOpen);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-header2" onClick={handleHeaderClick}>

        <span className='Question'>Combien y'a t'il de participants au maximum pour une session ?</span>
        <img
          className='downarrow2'
          src={downarrow}
          alt="dropdown arrow"
          style={{ transform: isArrowDown ? "rotate(360deg)" : "rotate(270deg)" }}
        />
      </div>
      {isOpen && (
        <div className="dropdown-list2" onClick={(e) => e.stopPropagation()}>
          <span className="response"><br/> Il n'y a pas de limites quant au nombre de participants pour chaque session.<br/><br/></span>
        </div>
        
      )}
    </div>
  );
};

export default DropdownSessionInfo;
