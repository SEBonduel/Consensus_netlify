import React, { useState } from 'react';
import downarrow from "../../../../../images/downarrow.png";
import "./dropdown.css";


const DropdownAHP = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isArrowDown, setIsArrowDown] = useState(true);

  const handleHeaderClick = () => {
    setIsOpen(!isOpen);
    setIsArrowDown(!isOpen);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-header2" onClick={handleHeaderClick}>

        <span className='Question'>What is the AHP method and the ratio of inconsistency?</span>
        <img
          className='downarrow2'
          src={downarrow}
          alt="dropdown arrow"
          style={{ transform: isArrowDown ? "rotate(360deg)" : "rotate(270deg)" }}
        />
      </div>
      {isOpen && (
        <div className="dropdown-list2" onClick={(e) => e.stopPropagation()}>
          <span className="response"><br/> When using the Analytic Hierarchy Process (AHP), the ratio of inconsistency is an indicator used to assess the consistency of judgments provided by a decision-maker when comparing alternatives in a multicriteria decision-making process.<br/><br/>

          The AHP process allows for the prioritization of criteria and alternatives based on their relative importance. The decision-maker compares criteria and alternatives pairwise and assigns numerical values called "weights" to the preference relations between them. The ratio of inconsistency is used to check if the assigned values are consistent with each other.<br/><br/>

          When the decision-maker evaluates the pairwise comparisons, they assign a value of 1 to the pair of criteria or alternatives that are considered equally important. Then, they assign values greater than 1 to pairs that are judged as more important and values less than 1 to pairs that are judged as less important. These numerical values must adhere to certain consistency rules to ensure the reliability of the obtained results.<br/><br/>

          The ratio of inconsistency is calculated from the pairwise comparison matrix provided by the decision-maker. It measures the gap between the actual assigned values and the ideal values that would be perfectly consistent. A high ratio of inconsistency indicates significant inconsistency among the decision-maker's judgments.

          To obtain the ratio of inconsistency, the actual inconsistency is divided by the random inconsistency. The actual inconsistency is calculated using the numerical values assigned by the decision-maker, while the random inconsistency is calculated using random values for pairwise comparisons. If the ratio of actual inconsistency to random inconsistency exceeds a predefined threshold (usually 0.1 or 0.2), it indicates significant inconsistency in the judgments.<br/><br/>


</span>
        </div>
        
      )}
    </div>
  );
};

export default DropdownAHP;
