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

        <span className='Question'>¿Qué es el método AHP y el ratio de inconsistencia?</span>
        <img
          className='downarrow2'
          src={downarrow}
          alt="dropdown arrow"
          style={{ transform: isArrowDown ? "rotate(360deg)" : "rotate(270deg)" }}
        />
      </div>
      {isOpen && (
        <div className="dropdown-list2" onClick={(e) => e.stopPropagation()}>
          <span className="response"><br/>Cuando se utiliza el Proceso Analítico Jerárquico (AHP, por sus siglas en inglés), el ratio de inconsistencia es un indicador utilizado para evaluar la consistencia de los juicios proporcionados por un tomador de decisiones al comparar alternativas en un proceso de toma de decisiones multicriterio.<br/><br/>

          El proceso AHP permite jerarquizar criterios y alternativas en función de su importancia relativa. El tomador de decisiones compara los criterios y las alternativas de dos en dos y asigna valores numéricos llamados "pesos" a las relaciones de preferencia entre ellos. El ratio de inconsistencia se utiliza para comprobar si los valores asignados son coherentes entre sí.<br/><br/>

          Cuando el tomador de decisiones evalúa las comparaciones de a pares, asigna un valor de 1 al par de criterios o alternativas que se consideran igualmente importantes. Luego, asigna valores mayores a 1 a los pares que se juzgan como más importantes y valores menores a 1 a los pares que se juzgan como menos importantes. Estos valores numéricos deben cumplir ciertas reglas de consistencia para garantizar la fiabilidad de los resultados obtenidos.<br/><br/>

          El ratio de inconsistencia se calcula a partir de la matriz de comparaciones de a pares proporcionada por el tomador de decisiones. Mide la diferencia entre los valores reales asignados y los valores ideales que serían perfectamente consistentes. Un ratio de inconsistencia alto indica una inconsistencia significativa entre los juicios del tomador de decisiones.

          Para obtener el ratio de inconsistencia, se utiliza la relación entre la inconsistencia real y la inconsistencia aleatoria. La inconsistencia real se calcula utilizando los valores numéricos asignados por el tomador de decisiones, mientras que la inconsistencia aleatoria se calcula utilizando valores aleatorios para las comparaciones de a pares. Si el ratio de inconsistencia real sobre inconsistencia aleatoria supera un umbral predefinido (generalmente 0,1 o 0,2), indica una inconsistencia significativa en los juicios.<br/><br/>


</span>
        </div>
        
      )}
    </div>
  );
};

export default DropdownAHP;
