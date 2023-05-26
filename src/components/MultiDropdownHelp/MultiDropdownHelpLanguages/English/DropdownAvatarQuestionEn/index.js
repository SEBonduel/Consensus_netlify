import React, { useState } from 'react';
import downarrow from "../../../../../images/downarrow.png";
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

        <span className='Question'>Can I choose any avatar for my account?</span>
        <img
          className='downarrow2'
          src={downarrow}
          alt="dropdown arrow"
          style={{ transform: isArrowDown ? "rotate(360deg)" : "rotate(270deg)" }}
        />
      </div>
      {isOpen && (
        <div className="dropdown-list2" onClick={(e) => e.stopPropagation()}>
          <span className="response"><br/> No, you cannot use just any avatar on a website, as it may infringe copyright laws, trademarks, or privacy rights.<br/><br/>

          It is important to comply with the laws and regulations regarding the use of images, logos, or trademarks. Some images may be licensed, which means you need to obtain permission from the owner before using them.<br/><br/>

          Additionally, it is important to consider the ethical implications of using an avatar. If the image you choose can be seen as offensive, discriminatory, or disturbing to certain individuals, you should choose another image that respects the standards of respect and tolerance towards others.<br/><br/></span>
        </div>
        
      )}
    </div>
  );
};

export default DropdownAvatarQuestion;
