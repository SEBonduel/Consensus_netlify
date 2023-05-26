import React, { useState } from 'react';
import downarrow from "../../../../../images/downarrow.png";
import "./dropdown.css";


const DropdownPwdHelpEsp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isArrowDown, setIsArrowDown] = useState(true);

  const handleHeaderClick = () => {
    setIsOpen(!isOpen);
    setIsArrowDown(!isOpen);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-header2" onClick={handleHeaderClick}>

        <span className='Question'>¿Has olvidado tu contraseña o deseas cambiarla?</span>
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
          <br/>Si has perdido tu contraseña, dirígete a la sección "¿Olvidaste tu contraseña?" en la página de inicio de sesión. Deberás ingresar tu dirección de correo electrónico y recibirás un correo con un enlace para cambiar tu contraseña.
Si deseas cambiar tu contraseña, ve a la sección "Cambiar contraseña" en la página de tu perfil.<br/><br/>
         </span> 
        </div>
        
      )}
    </div>
  );
};

export default DropdownPwdHelpEsp;
