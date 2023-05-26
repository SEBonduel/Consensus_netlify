import React, { useState } from 'react';
import downarrow from "../../../images/downarrow.png";
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

        <span className='Question'>Qu'est-ce que la méthode AHP et le ratio d'inconsistance ?</span>
        <img
          className='downarrow2'
          src={downarrow}
          alt="dropdown arrow"
          style={{ transform: isArrowDown ? "rotate(360deg)" : "rotate(270deg)" }}
        />
      </div>
      {isOpen && (
        <div className="dropdown-list2" onClick={(e) => e.stopPropagation()}>
          <span className="response"><br/> Lors de l'utilisation de la méthode AHP (Analytic Hierarchy Process), le ratio d'inconsistance est un indicateur utilisé pour évaluer la cohérence des jugements fournis par un décideur lorsqu'il compare les alternatives dans un processus de prise de décision multicritère.<br/><br/>

          Le processus AHP permet de hiérarchiser des critères et des alternatives en fonction de leur importance relative. Le décideur compare les critères et les alternatives deux à deux et attribue des valeurs numériques appelées "poids" aux relations de préférence entre eux. Le ratio d'inconsistance est utilisé pour vérifier si les valeurs attribuées sont cohérentes entre elles.<br/><br/>

          Lorsque le décideur évalue les comparaisons deux à deux, il attribue une valeur de 1 à la paire de critères ou d'alternatives qui est jugée équivalente en importance. Ensuite, il attribue des valeurs supérieures à 1 pour les paires qu'il juge plus importantes et des valeurs inférieures à 1 pour les paires qu'il juge moins importantes. Ces valeurs numériques doivent respecter certaines règles de cohérence pour garantir la fiabilité des résultats obtenus.<br/><br/>

          Le ratio d'inconsistance est calculé à partir de la matrice des comparaisons deux à deux fournie par le décideur. Il mesure l'écart entre les valeurs réelles attribuées aux comparaisons et les valeurs idéales qui seraient totalement cohérentes. Un ratio d'inconsistance élevé indique une incohérence importante entre les jugements du décideur.

Pour obtenir le ratio d'inconsistance, on utilise le rapport entre l'inconsistance réelle et l'inconsistance aléatoire. L'inconsistance réelle est calculée en utilisant les valeurs numériques attribuées par le décideur, tandis que l'inconsistance aléatoire est calculée en utilisant des valeurs aléatoires pour les comparaisons deux à deux. Si le ratio d'inconsistance réelle sur inconsistance aléatoire est supérieur à un seuil prédéfini (généralement 0,1 ou 0,2, soit entre 10% et 20%), cela indique une incohérence significative dans les jugements.<br/><br/>


</span>
        </div>
        
      )}
    </div>
  );
};

export default DropdownAHP;
