import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import FLAG from "../../images/flags.png";
import downarrow from "../../images/downarrow.png";
import FR from "../../images/fr.png";
import EN from "../../images/en.png";
import ESP from "../../images/esp.png";

const DropdownHistory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [setSelectedOption] = useState('Option 1');
  const [isArrowDown, setIsArrowDown] = useState(true);

  const handleHeaderClick = () => {
    setIsOpen(!isOpen);
    setIsArrowDown(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    setIsArrowDown(true);
  };

  const handleItemClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="dropdown">
      <div className="dropdown-header" onClick={handleHeaderClick}>
        <img className='flag' src={FLAG} alt="flag"/>
        <img
          className='downarrow'
          src={downarrow}
          alt="dropdown arrow"
          style={{ transform: isArrowDown ? "rotate(360deg)" : "rotate(270deg)" }}
        />
      </div>
      {isOpen && (
        <div className="dropdown-list" onClick={(e) => e.stopPropagation()}>
          <div className="dropdown-list-item" onClick={(e) => handleOptionClick('en')}>
            <NavLink className='to-en' to='/historyEn' onClick={handleItemClick}><img className='flags' src={EN} alt="en"></img><span className='countryName'>English</span></NavLink>
          </div>
          <div className="dropdown-list-item" onClick={(e) => handleOptionClick('fr')}>
            <NavLink className='to-fr' to='/history' onClick={handleItemClick}><img className='flags' src={FR} alt="fr"></img><span className='countryName'>Français</span></NavLink>
          </div>
          <div className="dropdown-list-item" onClick={(e) => handleOptionClick('esp')}>
            <NavLink className='to-esp' to='/historyEsp' onClick={handleItemClick}><img className='flags' src={ESP} alt="esp"></img><span className='countryName'>Español</span></NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownHistory;
