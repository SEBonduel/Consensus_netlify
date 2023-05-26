import React from 'react';
import { Radar } from 'react-chartjs-2';


const Diapo = (props) => {
    return (
        <div>
            <button onClick={props.left} >Gauche</button>
            <div className="radarContainer">
                <Radar className="negoRadar" data={props.chartData[props.diapoNum]} options={{maintainAspectRatio: false}}/>
            </div>
            <button onClick={props.right} >Droite</button>
        </div>
    )
}

export default Diapo;
