import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../Firebase';
import { NavLink } from 'react-router-dom';
import { usePage } from '../PageContext';
import { useCurrentSession } from '../CurrentSessionContext';
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-dragdata';
import { useHelp } from '../HelpContext';
import explication from '../../images/indiHelp.png';
import './individualDecision.css';
import Logout from '../Logout';
import undefinedPic from '../../images/undefined.png';

// Material UI :
/******************************************************* */
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DoneIcon from '@material-ui/icons/Done';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }));


/********************************************************** */


const IndividualDecision = (props) => {

    const [displayBar, setDisplayBar] = useState(false);

    const [preview, setPreview] = useState(undefined);

    const [code] = useState("");

    const [sessionData] = useState(null);

    const [displayChoose] = useState(false);

    const [anchorEl] = React.useState(null);

    const [open] = React.useState(false);

    const [placement] = React.useState();

    const classes = useStyles();

    const firebase = useContext(FirebaseContext);

    const { setCurrentHelp } = useHelp();

    const [userSession, setUserSession] = useState(null);

    const { setCurrentPage } = usePage();

    const { setIdCurrentSession } = useCurrentSession();

    const [userGroup, setUserGroup] = useState("");
    
const initialData = {
    alternatives: [],
    criteria: [],
    description: "",
    group: [],
    roles: [],
    name: "",
    owner: "",
    participants: {},
    round: 5,
    time: 15,
    stage: 0
}

// ia rates :
const ia = {
    2: 0,
    3: 0.58,
    4: 0.90,
    5: 1.12,
    6: 1.24,
    7: 1.32,
    8: 1.41,
    9: 1.45,
    10: 1.49,
    11: 1.51
}

// graph colors :
const backgroundColor = ['#1d334a', '#f39f18', '#DE0C0C', '#E1E40C', '#F4952A', '#2AF4C5', '#235E16', '#5E5616', '#1b5583' ];

// inconsistency ratio :
const [rc, setRc] = useState(0);

const [userData, setUserData] = useState({});
const [userStage, setUserStage] = useState(0);
const [validatedStage, setValidatedStage] = useState(false);
const [critWeightRound, setCritWeightRound] = useState([{test: 78}]);
const [ceci, setCeci] = useState({index: 0, value: 14}); // à changer ...
const [participants2, setParticipants2] = useState([]);


const [data, setData] = useState(initialData);
const [idSession, setIdSession] = useState("");
const { alternatives, criteria } = data;
const [indexAHP, setIndexAHP] = useState({});
const [matrixAHP, setMatrixAHP] = useState([]);
// vector which contains the weight of each criteria :
const [critWeight, setCritWeight] = useState([]);

useEffect(() => {
    setIdCurrentSession(true);
    setCurrentPage("global2");
    setCurrentHelp(explication);
    let listener = firebase.auth.onAuthStateChanged(user => {
        user ? setUserSession(user) : props.history.push("/");
    });
    return () => {
        listener()
    };
}, [])

useEffect(() => {
    if (userSession) {
        const userSessionRef = (userSession !== null) && firebase.db.collection("users").doc(userSession.uid);
        userSessionRef &&
        userSessionRef.get().then((doc) => {
            if (!doc.exists) return;
            setIdSession(doc.data().userSessions[doc.data().userSessions.length-1]);
            setUserData(doc.data().pseudo);
        })
    }
}, [userSession,])


useEffect(() => {
    if (idSession !== ""){
        let unsubscribe1 = firebase.db.collection("sessions").doc(idSession).onSnapshot((doc) => {
            if (!doc.exists) return;
            setData(doc.data());
        });
        let unsubscribe3 = firebase.db.collection(`sessions/${idSession}/participants`).doc(userSession.uid).onSnapshot((doc) => {
            if (!doc.exists) return;
            setCritWeightRound(doc.data().criteriaWeight);
        });
        let userRef = (userSession !== null) && firebase.db.collection(`sessions/${idSession}/participants`).doc(userSession.uid).onSnapshot((doc) => {
            if (!doc.exists) return;
            setUserGroup(doc.data().userGroup);
        })
        return () => {
            unsubscribe1();
            unsubscribe3();
            userRef();
        }
    }
}, [idSession,])

useEffect(() => {
    userSession &&
    firebase.db.collection("users").doc(userSession.uid).get().then((doc) => {
        setUserData(doc.data());
      });
}, [userSession])


// Redirect to recap page 
useEffect(() => {
    if (sessionData && userData && !sessionData.startSession) {
        let userSessionsUpdated = userData.userSessions;
        if (!userSessionsUpdated.includes(code)) userSessionsUpdated.push(code);
        firebase.saveUserSession(userSession.uid).set({userSessions: userSessionsUpdated}, {merge: true});
        let participantsUpdated = {...sessionData.participants, [userSession.uid]: {userPseudo: userData.pseudo, userGroup: "", userRole: "", userStage: 0, validatedStage: false, criteriaWeight: sessionData.criteria.map(crit => {return {label: crit.label, weight: 0}})}};
        firebase.saveSession(code).set({participants: participantsUpdated}, {merge: true});
        firebase.saveParticipants(code, userSession.uid).set({step: 'R', uid: userSession.uid, userPseudo: userData.pseudo, userGroup: "", userRole: "", userStage: 0, endNego: false, consensus: false, noconsensus: false, validatedStage: null, criteriaWeight: sessionData.criteria.map(crit => {return {label: crit.label, weight: 0}})});
        props.history.push("/recap");
    }
}, [sessionData, userData])

useEffect(() => {
  if (userSession) {
      let unsubscribe2 = (userSession !== null) && firebase.db.collection("users").doc(userSession.uid).onSnapshot((doc => {
          if (!doc.exists) return;
          setPreview(doc.data().avatar);
      })); 
      return () => {
          unsubscribe2();
      }
  }
}, [firebase.db, userSession])

useEffect(() => {
    if (userGroup !== "") {
        let unsubscribe2 = firebase.db.collection(`sessions/${idSession}/participants`).onSnapshot((querySnapshot) => {
            let participantsUpdated = [];
            querySnapshot.forEach((doc) => {
                participantsUpdated.push(doc.data());
                if (doc.data().uid === userSession.uid) {
                    setUserStage(doc.data().userStage);
                    setValidatedStage(doc.data().validatedStage);
                }
            });
            setParticipants2(participantsUpdated);
        });
        return () => {
            unsubscribe2();
        }
    }
}, [userGroup])



// cursor part :
/****************************************************************************************************** */
let pairs = (arr) => arr.map( (v, i) => arr.slice(i + 1).map(w => [v, w]) ).flat();

const tab = pairs(criteria);

const [cursorValue, setCursorValue] = useState({});

useEffect(() => {
    let cursorValueUpdated = {};
    tab.map((cursor, index) => {
        cursorValueUpdated = {...cursorValueUpdated, [index]: "0"};
    });
    setCursorValue(cursorValueUpdated);
    let initIndexAHP = {};
    let initMatrixRowAHP = [];
    let initMatrixAHP = [];
    criteria.map((crit, index) => {
        initIndexAHP = {...initIndexAHP, [crit.label]: index};
        initMatrixRowAHP.push(1);
    });
    initMatrixRowAHP.map(elt => {
        initMatrixAHP.push(initMatrixRowAHP);
    });
    setIndexAHP(initIndexAHP);
    setMatrixAHP(initMatrixAHP);
}, [data])

const cursorChange = (e) => {
    let crit1Num = e.target.dataset.crit1;
    let crit2Num = e.target.dataset.crit2;
    let copy = {...cursorValue, [e.target.id]: e.target.value};

    // for each change of cursor value, we recalculate the AHP matrix :
    setMatrixAHP(matrixAHP.map((elt, lineInd) => {      
        return elt.map((elt2, rowInd) => {
            if ((lineInd === indexAHP[crit1Num]) && (rowInd === indexAHP[crit2Num])) {
                if (parseInt(copy[e.target.id])<0) {
                    return Math.abs(parseInt(copy[e.target.id]))+1;
                }
                else {
                    return 1/(Math.abs(parseInt(copy[e.target.id]))+1);
                }
            }
            else if ((lineInd === indexAHP[crit2Num]) && (rowInd === indexAHP[crit1Num])) {
                if (parseInt(copy[e.target.id])<0) {
                    return 1/(Math.abs(parseInt(copy[e.target.id]))+1);
                }
                else {
                    return Math.abs(parseInt(copy[e.target.id]))+1;
                }
            }
            else {
                return elt2;
            }
        });
    }));
    setCursorValue(copy);
}
/*********************************************************************************************************** */


// update of criteria weights + inconsistency ratio when AHP matrix changes :
useEffect(() => {
    let divisor = {};
    let matrixAHPrime = matrixAHP;
    let criteriaWeight = [];
    for (let i = 0; i < matrixAHP.length; i++) {
        let divisorValue = 0;
        for (let j = 0; j < matrixAHP.length; j++) {
            divisorValue = divisorValue + matrixAHP[j][i];
        }
        divisor = {...divisor, [i]: divisorValue};
    }
    matrixAHPrime = matrixAHPrime.map((elt, index) => {
        return elt.map((elt2, index2) => {
            return elt2/divisor[index2];
        });
    });
    matrixAHPrime.map(elt => {
        let sum = 0;
        elt.map(elt2 => {
            sum = sum + elt2;
        });
        criteriaWeight.push(sum/matrixAHPrime.length);
    });
    setCritWeight(criteriaWeight);
    let lambda = [];
    matrixAHP.map(elt => {
        let sumW = 0;
        elt.map((elt2, index2) => {
            sumW = sumW + elt2*criteriaWeight[index2];
        });
        lambda.push(sumW);
    });
    let lambdaMax = 0;
    lambda.map((elt, index) => {
        lambdaMax = lambdaMax + elt/criteriaWeight[index];
    });
    lambdaMax = lambdaMax/criteriaWeight.length;
    setRc((((lambdaMax - criteriaWeight.length)/(criteriaWeight.length-1))/ia[criteriaWeight.length])*100);
}, [matrixAHP])


// Best case scenario calculation and send data to firestore ( fisrt round ) :
const handleClick = () => {
    let alternativesCopy = alternatives.map(alt => {
        return alt.evaluation.map((ev, index) => {
            if (!criteria[index].goal && parseInt(ev) !== 0) {
                return 1/ev;
            } else {
                return ev;
            }
        });
    });


    let rowSum = [];
    for (let i = 0; i < criteria.length; i++) {
        let cumul = 0;
        for (let j = 0; j < alternativesCopy.length; j++) {
            cumul += alternativesCopy[j][i];
        }
        rowSum.push(cumul);
    }
    alternativesCopy = alternativesCopy.map(alt => {
        return alt.map((elt, index) => {
            if (elt == 0) return elt;
            return elt/rowSum[index];
        });
    });
    let bestAlternative = -1;
    let comp = 0;
    for (let i = 0; i < alternativesCopy.length; i++) {
        let cumul = 0;
        for (let j = 0; j < criteria.length; j++) {
            cumul += alternativesCopy[i][j] * critWeight[j];
        }
        if (cumul >= comp) {
            comp = cumul;
            bestAlternative = i;
        }
    }
    let youAreTheLast = true;
        participants2.map(p => {
            if ((p.uid !== userSession.uid) && !p.validatedStage) {
                youAreTheLast = false;
            }
        });
    youAreTheLast && firebase.saveGroup(idSession, userGroup).set({start: Date.parse(new Date())}, {merge: true});
    firebase.saveParticipants(idSession, userSession.uid).set({step: 'N', bestAlternative: bestAlternative, validatedStage: true, criteriaWeight: critWeight.map((cw, ind) => {return {label: criteria[ind].label, weight: Number.parseFloat(cw).toFixed(2)}})}, {merge: true});
    props.history.push("/negociation");
}


// Update of the values displayed on the histogram :
useEffect(() => {
    let diff = critWeightRound[ceci.index].weight - ceci.value / 100;
    let rate = [];
    let totalSum = 0;
    
    for (let i = 0; i < critWeightRound.length; i++) {
        if (i !== ceci.index) {
            totalSum += Number.parseFloat(critWeightRound[i].weight);
        }
    }
    for (let i = 0; i < critWeightRound.length; i++) {
        rate.push(Number.parseFloat(critWeightRound[i].weight) / totalSum);
    }
    
    setCritWeightRound(critWeightRound.map((c, ind) => {
        if (ind === ceci.index) {
            return {label: c.label, weight: ceci.value / 100};
        } else {
            return {label: c.label, weight: Number.parseFloat(c.weight) + diff * rate[ind]};
        }
    }));
}, [ceci])


// Best case scenario calculation and send data to firestore ( after first round ) :
const handleClick2 = () => {
    let youAreTheLast = true;
    participants2.map(p => {
        if ((p.uid !== userSession.uid) && !p.validatedStage) {
            youAreTheLast = false;
        }
    });

    let alternativesCopy = alternatives.map(alt => {
        return alt.evaluation.map((ev, index) => {
            if (!criteria[index].goal && parseInt(ev) !== 0) {
                return 1/ev;
            } else {
                return ev;
            }
        });
    });


    let rowSum = [];
    for (let i = 0; i < criteria.length; i++) {
        let cumul = 0;
        for (let j = 0; j < alternativesCopy.length; j++) {
            cumul += alternativesCopy[j][i];
        }
        rowSum.push(cumul);
    }

    alternativesCopy = alternativesCopy.map(alt => {
        return alt.map((elt, index) => {
            if (elt == 0) return elt;
            return elt/rowSum[index];
        });
    });


    let bestAlternative = -1;

    let comp = 0;


    for (let i = 0; i < alternativesCopy.length; i++) {
        let cumul = 0;
        for (let j = 0; j < criteria.length; j++) {
            cumul += alternativesCopy[i][j] * Number.parseFloat(critWeightRound[j].weight);
        }
        if (cumul >= comp) {
            comp = cumul;
            bestAlternative = i;
        }
    }

    youAreTheLast && firebase.saveGroup(idSession, userGroup).set({start: Date.parse(new Date())}, {merge: true});
    firebase.saveParticipants(idSession, userSession.uid).set({step: 'N', bestAlternative: bestAlternative, validatedStage: true, criteriaWeight: critWeightRound.map(c => ({...c, weight: Number(c.weight).toFixed(2)}))}, {merge: true});
    props.history.push("/negociation");

}

// Redirect to negociation page :
useEffect(() => {
    validatedStage && props.history.push("/negociation");
}, [validatedStage])



return (userStage === 0 ?

<div className="full-page">
<header className="header">

<nav className="navbar-global-connected">
  <div className="app-title-connected">
    <h1 className='consensus-title-connected'>ConsensUs</h1><style>@import url('https://fonts.googleapis.com/css2?family=Palanquin+Dark:wght@400;500;700&display=swap');</style>
    <div className="navbar-subtitle-connected">
      <NavLink className="home-link-nav-connected" to="login">Accueil</NavLink>
      <NavLink className="about-link-nav-connected" to="aboutConnected">A propos</NavLink>
      <NavLink className="help-link-nav-connected" to="helpConnected">Aide</NavLink>
      
      <Logout/>
      <div className='profil-pic'>
      {(displayChoose || preview === undefined) ? (
        <NavLink to="profile">
          <img
            id='profile-picture-nav'
            style={{height:'60px', width:'60px', margin: 'auto'}}
            src={undefinedPic}
            alt="UndefinedPic"
          />
        </NavLink>
      ) : (
        <NavLink to="profile">
          <img
            id='profile-picture-nav'
            style={{height:'60px', width:'60px', margin: 'auto'}}
            src={preview}
            alt="Preview"
          />
        </NavLink>
      )}
    
</div>
    </div>
  </div>
</nav>
</header>     
        <div className="comparing-content">
            <h1 className='slogan'>Veuillez comparer les critères deux à deux</h1>
                <div className='ahp'>                
                    {tab.map((crit, index) => (
                        <div className="critDisplay">
                            <div style={{wordWrap: 'break-word', textAlign: 'center', width: '150px',  color: '#000000'}}>
                                <span className='left-criteria'>{crit[0].label}</span>
                            </div>
                            <div>
                                <h6 style={{marginLeft: `${3.8+(parseInt(cursorValue[index])+5.25)*1.45}vw`, backgroundColor: '#B3D7EB', width: `20px`, height:'20px', borderRadius: '50%', textAlign: "center"}}> 
                                    <span>{Math.abs(cursorValue[index])+1}</span>
                                </h6>
                                <input type="range" className="cursor" id={index} data-crit1={crit[0].label} data-crit2={crit[1].label} min="-8" max="8" step="1" value={cursorValue[index]} onChange={cursorChange} />
                            </div>                
                            <div style={{wordWrap: 'break-word', textAlign: 'center', width: '150px',  color: '#000000' }}>
                            <span className='right-criteria'>{crit[1].label}</span>
                            </div>          
                        </div>
                    ))}             
                </div>
            <div className='visual-criteria'>
                <span className='ratio'><strong>Ratio d'inconsistance : {Number.parseFloat(rc).toFixed(2)} %</strong></span>
                <div className='visual-criteria-display'>
      <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
                <div style={{margin: 'auto', padding: '40px 40px'}}>
                    <Bar type="bar" options={{maintainAspectRatio: false}} data={{
                    labels: criteria.map(crit => crit.label),
                    datasets: critWeight.map((p, ind) => {
                        let datasetInit = [];
                        for (let i = 0; i < ind; i++) {
                            datasetInit.push(0);
                        }
                        datasetInit.push(Number(p * 100).toFixed(2));
                        return {
                            label: criteria[ind].label,
                            backgroundColor: backgroundColor[ind],
                            data: datasetInit
                        }
                    }) 
                }} options={{
                    scales: {
                    xAxes: [
                        {
                        stacked: true,
                        barPercentage: 1,
                        categoryPercentage: 0.8
                        }
                    ],
                    yAxes: [
                        {
                        stacked: true,
                        ticks: {
                            max: 99.9,
                            min: 1
                        }
                        }
                    ]
                    }
                }} />
                </div>
            </Paper>
          </Fade>
        )}
      </Popper>
    
      {displayBar &&
      <div className={{margin: 'auto', padding: '40px 40px', width: '700px', height: '600px'}}>
                    <Bar type="bar" options={{maintainAspectRatio: false}} data={{
                    labels: criteria.map(crit => crit.label),
                    datasets: critWeight.map((p, ind) => {
                        let datasetInit = [];
                        for (let i = 0; i < ind; i++) {
                            datasetInit.push(0);
                        }
                        datasetInit.push(Number(p * 100).toFixed(2));
                        return {
                            label: criteria[ind].label,
                            backgroundColor: backgroundColor[ind],
                            data: datasetInit
                        }
                    }) 
                }} options={{
                    scales: {
                    xAxes: [
                        {
                        stacked: true,
                        barPercentage: 1,
                        categoryPercentage: 0.8
                        }
                    ],
                    yAxes: [
                        {
                        stacked: true,
                        ticks: {
                            max: 99.9,
                            min: 1
                        }
                        }
                    ]
                    }
                }} />
                </div>}
        <Button onClick={() => setDisplayBar(!displayBar)} variant="contained" style={{backgroundColor:"rgb(241, 207, 12)", marginBottom:"2em"}}>
            <EqualizerIcon style={{color:'#1d334a'}} />
            <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "#1d334a"}}>
                {displayBar ? "Masquer l'histogramme" : "Visualiser les poids des critères"}
            </Typography>
        </Button>
    
            
            
        <Button onClick={handleClick} variant="contained" style={{backgroundColor:"#49D009"}}>
            <DoneIcon style={{color:'#1d334a'}} />
            <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "#1d334a"}}>
                Valider
            </Typography>
        </Button>
        </div>
    </div>
            </div>
            </div>
    :
    <div className="recapDesign">
        <h1 style={{fontSize: '2vw'}}>Vous pouvez modifier vos préférences en glissant les barres</h1>
        <div style={{margin: 'auto', width: '65vw', height: '70vh', marginTop: '20px'}}>
        <Bar type="bar" options={{maintainAspectRatio: false}} data={{
        labels: critWeightRound.map(crit => crit.label),
        datasets: critWeightRound.map((p, ind) => {
            let datasetInit = [];
            for (let i = 0; i < ind; i++) {
                datasetInit.push(0);
            }
            datasetInit.push(Number(p.weight * 100).toFixed(2));
            return {
                label: p.label,
                backgroundColor: backgroundColor[ind],
                data: datasetInit
            }
        }) 
    }} options={{
        dragData: true,
        dragDataRound: 2,
        dragOptions: {
          showTooltip: true
        },
        onDragEnd: (e, datasetIndex, index, value) => {
          e.target.style.cursor = 'default';
          if (value > 100) {
                setCeci({index: datasetIndex, value: 99.9});
            } else if (value <= 0 ) {
                setCeci({index: datasetIndex, value: 1});
          } else {
                setCeci({index: datasetIndex, value: value});
          }
        },
        hover: {
          onHover: function(e) {
            const point = this.getElementAtEvent(e);
            if (point.length) e.target.style.cursor = 'grab';
            else e.target.style.cursor = 'default';
          }
        },
        scales: {
          xAxes: [
            {
              stacked: true,
              barPercentage: 1,
              categoryPercentage: 0.8
            }
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                max: 99.9,
                min: 1
              }
            }
          ]
        }
      }} />
      </div>
      <Button onClick={handleClick2} variant="contained" style={{backgroundColor:"#49D009", margin: 'auto', marginBottom: '100px'}}>
            <DoneIcon style={{color:'1d334a'}} />
            <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "#1d334a"}}>
                Valider
            </Typography>
        </Button>
    </div>)
;

}
export default IndividualDecision;
