import React, { useState } from 'react';
import downarrow from "../../../images/downarrow.png";
import "./dropdown.css";


const DropdownAvatarQuestion = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isArrowDown, setIsArrowDown] = useState(true);

  const handleHeaderClick = () => {
    setIsOpen(!isOpen);
    setIsArrowDown(!isOpen);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-header2" onClick={handleHeaderClick}>

        <span className='Question'>Puis-je choisir n'importe quel avatar pour mon compte ?</span>
        <img
          className='downarrow2'
          src={downarrow}
          alt="dropdown arrow"
          style={{ transform: isArrowDown ? "rotate(360deg)" : "rotate(270deg)" }}
        />
      </div>
      {isOpen && (
        <div className="dropdown-list2" onClick={(e) => e.stopPropagation()}>
          <span className="response"><br/> Non, vous ne pouvez pas mettre n'importe quel avatar sur un site, car cela peut enfreindre les lois sur les droits d'auteur, les marques déposées ou la vie privée.<br/><br/>

Il est important de respecter les lois et règlements en vigueur concernant l'utilisation d'images, de logos ou de marques déposées. Certaines images peuvent être sous licence, ce qui signifie que vous devez obtenir l'autorisation du propriétaire avant de les utiliser.<br/><br/>

De plus, il est important de considérer les implications éthiques de l'utilisation d'un avatar. Si l'image que vous choisissez peut être considérée comme offensante, discriminatoire ou dérangeante pour certaines personnes, vous devriez choisir une autre image qui respecte les normes de respect et de tolérance envers les autres.<br/><br/></span>
        </div>
        
      )}
    </div>
  );
};

export default DropdownAvatarQuestion;
