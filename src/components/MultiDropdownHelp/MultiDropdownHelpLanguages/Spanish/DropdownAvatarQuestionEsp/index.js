import React, { useState } from 'react';
import downarrow from "../../../../../images/downarrow.png";
import "./dropdown.css";


const DropdownAvatarQuestionEsp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isArrowDown, setIsArrowDown] = useState(true);

  const handleHeaderClick = () => {
    setIsOpen(!isOpen);
    setIsArrowDown(!isOpen);
  };


  return (
    <div className="dropdown">
      <div className="dropdown-header2" onClick={handleHeaderClick}>

        <span className='Question'>¿Puedo elegir cualquier avatar para mi cuenta?</span>
        <img
          className='downarrow2'
          src={downarrow}
          alt="dropdown arrow"
          style={{ transform: isArrowDown ? "rotate(360deg)" : "rotate(270deg)" }}
        />
      </div>
      {isOpen && (
        <div className="dropdown-list2" onClick={(e) => e.stopPropagation()}>
          <span className="response"><br/>No, no puedes utilizar cualquier avatar en un sitio web, ya que podría infringir leyes de derechos de autor, marcas registradas o privacidad.<br/><br/>

          Es importante respetar las leyes y regulaciones vigentes en relación al uso de imágenes, logotipos o marcas registradas. Algunas imágenes pueden estar bajo licencia, lo que significa que necesitas obtener permiso del propietario antes de utilizarlas.<br/><br/>

          Además, es importante considerar las implicaciones éticas del uso de un avatar. Si la imagen que eliges puede resultar ofensiva, discriminatoria o perturbadora para algunas personas, debes seleccionar otra imagen que cumpla con los estándares de respeto y tolerancia hacia los demás.<br/><br/></span>
        </div>
        
      )}
    </div>
  );
};

export default DropdownAvatarQuestionEsp;
