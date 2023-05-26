import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../Firebase';
import { usePage } from '../PageContext';
import { useCurrentSession } from '../CurrentSessionContext';
import { Radar } from 'react-chartjs-2';
import { useHelp } from '../HelpContext';
import explication from '../../images/negoHelp.png';
import { NavLink } from 'react-router-dom';
import Logout from '../Logout';
import undefinedPic from '../../images/undefined.png';
import "./negociation.css";



// Material UI :
/***************************************************************** */
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';

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
/******************************************************************** */



const Negociation = (props) => {
    const [preview, setPreview] = useState(undefined);

    const [code] = useState("");

    const [sessionData] = useState(null);

    const [userData, setUserData] = useState(null);

    const [displayChoose] = useState(false);

    const classes = useStyles();

    const firebase = useContext(FirebaseContext);

    const { setCurrentHelp } = useHelp();

    const { setIdCurrentSession } = useCurrentSession();

    const { setCurrentPage } = usePage();

    const [redirection, setRedirection] = useState(false);

    const [userSession, setUserSession] = useState(null);

    const [criticalCrit, setCriticalCrit] = useState([]);

    const [participants2, setParticipants2] = useState([]);

    const [userStage, setUserStage] = useState(0);

    const [specialButton, setSpecialButton] = useState(false);

    const [launch, setLaunch] = useState(false);

    const [userGroup, setUserGroup] = useState("");

    const [start, setStart] = useState(null);

    const [criteriaWeightRound, setCriteriaWeightRound] = useState([]);

    const [criteriaByStep, setCriteriaByStep] = useState({});

    const backgroundColor = ['#1d334a', '#f39f18', '#DE0C0C', '#10DE0C', '#F4952A', '#2AF4C5', '#235E16', '#5E5616', '#1b5583', ];

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
        stage: 1
    }

    const [data, setData] = useState(initialData);

    const [idSession, setIdSession] = useState("");

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


    // Id session recovery
    useEffect(() => {
        if (userSession) {
            const userSessionRef = (userSession !== null) && firebase.db.collection("users").doc(userSession.uid);
            userSessionRef &&
            userSessionRef.get().then((doc) => {
                if (!doc.exists) return;
                setIdSession(doc.data().userSessions[doc.data().userSessions.length-1]);
            })
        }
    }, [userSession])


    // Session data recovery
    useEffect(() => {
        if (idSession !== ""){
            let unsubscribe1 = firebase.db.collection("sessions").doc(idSession).onSnapshot((doc) => {
                if (!doc.exists) return;
                setData(doc.data());
            });
            let userRef = (userSession !== null) && firebase.db.collection(`sessions/${idSession}/participants`).doc(userSession.uid).onSnapshot((doc) => {
                if (!doc.exists) return;
                setUserGroup(doc.data().userGroup);
                setCriteriaWeightRound(doc.data().criteriaWeight);
                setCriteriaByStep(doc.data().criteriaByStep);
            })
            return () => {
                unsubscribe1();
                userRef();
            }
        }
    }, [idSession])


    // Group data recovery
    useEffect(() => {
        if (userGroup !== "") {
            const groupRef = (userSession !== null) && firebase.db.collection(`sessions/${idSession}/groups`).doc(userGroup);
            groupRef &&
            groupRef.get().then((doc) => {
                if (!doc.exists) return;
                setStart(doc.data().start);
            })
            let unsubscribe2 = firebase.db.collection(`sessions/${idSession}/participants`).where("userGroup", "==", userGroup).onSnapshot((querySnapshot) => {
                let participantsUpdated = [];
                querySnapshot.forEach((doc) => {
                    participantsUpdated.push(doc.data());
                    if (doc.data().uid === userSession.uid) {
                        setUserStage(doc.data().userStage);
                    }
                });
                setParticipants2(participantsUpdated);
            });
            return () => {
                unsubscribe2();
            }
        }
    }, [userGroup])


    useEffect(() => {
        if (userStage + 1 === round) {
            setSpecialButton(true);
        } 
    }, [userStage])

    // General information of the current session :
    const { alternatives, criteria, owner, round, time} = data;

    const [alternativesCopy, setAlternativesCopy] = useState(alternatives);

    const [chartData, setChartData] = useState({});
    
    const [turnKey, setTurnKey] = useState(round);

    const [redirectionConsensus, setRedirectionConsensus] = useState(false);

    const [nbConsensus, setNbConsensus] = useState(0);

    const [nbNoConsensus, setNbNoConsensus] = useState(0);

    const [nbEndNego, setNbEndNego] = useState(0);


    // Check consensus, noconsensus, endNego for all participants 
    useEffect(() => {
        if (participants2.length !== 0) {
            let alternatives2 = alternatives;
            alternatives2 = alternatives2.map(a => { return {...a, users: []}});
            let redirectionUpdated = true;
            let redirectionCUpdated = true;
            let redirectionNCUpdated = true; 
            let nbConsensusU = 0;
            let nbNoConsensusU = 0;
            let nbEndNegoU = 0;
            let launchUpdated = true;
            participants2.map(p => {
                alternatives2.map((a, ind) => {
                    if (ind === p.bestAlternative) {
                        let usersCopy = a.users;
                        usersCopy.push(p.userPseudo);
                        return {...a, users: usersCopy};
                    }
                });
                if (p.validatedStage === false) launchUpdated = false;
                if (p.endNego === false) {
                    redirectionUpdated = false;
                } else {
                    nbEndNegoU = nbEndNegoU + 1;
                }
                if (p.consensus === false) {
                    redirectionCUpdated = false;
                } else {
                    nbConsensusU = nbConsensusU + 1;
                }
                if (p.noconsensus === false) {
                    redirectionNCUpdated = false;
                } else {
                    nbNoConsensusU = nbNoConsensusU + 1;
                }
            });
            setLaunch(launchUpdated);
            setAlternativesCopy(alternatives2);
            setNbConsensus(nbConsensusU);
            setNbNoConsensus(nbNoConsensusU);
            setNbEndNego(nbEndNegoU);
            setRedirection(redirectionUpdated);
            setRedirectionConsensus(redirectionCUpdated || redirectionNCUpdated);
        }
    }, [participants2])


    // retirect to individual decision page
    useEffect(() => {
        if (redirection) {
            firebase.saveParticipants(idSession, userSession.uid).set({step: 'D', userStage: userStage + 1, criteriaByStep: {...criteriaByStep, [userStage+1]: criteriaWeightRound}, endNego: false, validatedStage: false, consensus: false}, {merge: true});
            firebase.saveGroup(idSession, userGroup).set({start: null}, {merge: true});
            props.history.push("/individualDecision");
        }
        else if ((participants2.length !== 0) && (nbEndNego !== 0) && (nbEndNego + nbConsensus === participants2.length)) {
            firebase.saveParticipants(idSession, userSession.uid).set({step: 'D', userStage: userStage + 1, criteriaByStep: {...criteriaByStep, [userStage+1]: criteriaWeightRound}, endNego: false, validatedStage: false, consensus: false}, {merge: true});
            firebase.saveGroup(idSession, userGroup).set({start: null}, {merge: true});
            props.history.push("/individualDecision");
        }
    }, [redirection, nbEndNego, nbConsensus])

    // redirect to consensus page
    useEffect(() => {
        if ((participants2.length !== 0) && (redirectionConsensus || nbNoConsensus + nbConsensus === participants2.length)) {
            firebase.saveParticipants(idSession, userSession.uid).set({step: 'C', userStage: userStage + 1, criteriaByStep: {...criteriaByStep, [userStage+1]: criteriaWeightRound}}, {merge: true});
            props.history.push("/consensus");
        }
    }, [redirectionConsensus, nbConsensus, nbNoConsensus])


    // Update radar :
    useEffect(() => {
        let datasetInit = []
        let sumCriteriaWeight = [];
        participants2.map((p, ind) => {
            datasetInit.push({
                label: p.userPseudo,
                data: (p.criteriaWeight).map(cw => cw.weight),
                backgroundColor: backgroundColor[ind],
                borderWidth: 4
            });
            p.criteriaWeight.map((crit, index) => {
                sumCriteriaWeight[index] += parseFloat(crit.weight);
            });
        });
        sumCriteriaWeight.map(sumCrit => sumCrit/participants2.length);
        let criticalCriteria = sumCriteriaWeight.map((r, ind) => {return {val: 0, pos: ind}});
        participants2.map(p => {
            p.criteriaWeight.map((crit, index) => {
                criticalCriteria[index].val += Math.abs(parseFloat(crit.weight) - sumCriteriaWeight[index]);
            });
        });
        criticalCriteria.sort(function compare(a, b) {
            if (a.val > b.val)
               return -1;
            if (a.val < b.val)
               return 1;
            return 0;
          })
        setCriticalCrit(criticalCriteria);
        setChartData({
            labels: criteria.map(crit => crit.label),
            datasets: datasetInit,
        })

    }, [data, participants2])


    // To order alternatives :
    const orderedAlternatives = alternativesCopy;
    orderedAlternatives.sort(function compare(a, b) {
        if (a.users.length > b.users.length)
           return -1;
        if (a.users.length < b.users.length)
           return 1;
        return 0;
      });


    // To add turn to the current session :
    const addTurn = () => {
        data.round = Number.parseInt(data.round) + 1;
        firebase.saveSession(idSession).set({round : data.round}, {merge: true});
        setTurnKey(turnKey + 1);
    }


    const { initialSeconds = 0 } = props;
    const [ minutes, setMinutes ] = useState(time);
    const [seconds, setSeconds ] =  useState(initialSeconds);

    useEffect(() => {
        if (start !== null && launch) {
            if ((Math.floor(((Date.parse(new Date) - start) / 1000) % 60)) !== 60) {
                setMinutes(time - (Math.floor(((Date.parse(new Date) - start) / 1000 / 60) % 60)) - 1);
                setSeconds(60 - (Math.floor(((Date.parse(new Date) - start) / 1000) % 60)));
            } else {
                setMinutes(time - (Math.floor(((Date.parse(new Date) - start) / 1000 / 60) % 60)));
                setSeconds(0);
            }
        }
    }, [start])


    useEffect(()=>{
    let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(myInterval)
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            } 
        }, 1000)
        return ()=> {
            clearInterval(myInterval);
          };
    });


// to change prefrences
const endNego = () => {
    firebase.saveParticipants(idSession, userSession.uid).set({validatedStage: false, endNego: true}, {merge: true});
}

// for a consensus
const consensus = () => {
    firebase.saveParticipants(idSession, userSession.uid).set({validatedStage: false, consensus: true, noconsensus: false}, {merge: true});
}

// for no consensus
const noConsensus = () => {
    firebase.saveParticipants(idSession, userSession.uid).set({noconsensus: true, consensus: false}, {merge: true});
}

// to redirect to individual decision page if time is up
const [etat, setEtat] = useState(false);

useEffect(() => {
    if (minutes === 0 && seconds === 1 && launch) {
        setEtat(true);
    } 
}, [seconds])

useEffect(() => {
    if (userSession !== null && !specialButton) {
        firebase.saveParticipants(idSession, userSession.uid).set({step: 'D', userStage: userStage + 1, criteriaByStep: {...criteriaByStep, [userStage+1]: criteriaWeightRound}, validatedStage: false, endNego: false, consensus: false}, {merge: true});
        firebase.saveGroup(idSession, userGroup).set({start: null}, {merge: true});
        props.history.push("/individualDecision");
    }
}, [etat])

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

    return (
        <div className="entire-page">
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
            <div className="nego-content">
                <h1 className='slogan'>Argumentez pour trouver un consensus</h1>
                <div>
                    <div>
                        <div className='timer-current-session'>
                            <div className='round-number'>
                                <h6 className='current-round-title'>Tour en cours : {userStage + 1}/{round}</h6>
                                {userSession !== null && (owner === userSession.uid) &&                                         
                                        <IconButton onClick={addTurn} style={{borderRadius: '5px', color: '#1d334a', backgroundColor: 'transparent', height: '20px', width: '20px'}}>
                                        <AddIcon />
                                    </IconButton>
                                }
                            </div>
                            <div className='total-time-for-rounds'>
                                    <h6 className='total-timer'>Temps global : {parseInt(time)*round} minutes </h6>
                            </div>
                            <div className='timer'>{ minutes === 0 && seconds === 0? null: 
                                <h6 className='total-time-left'>{launch ? `Temps restant du tour en cours : ${minutes}:${seconds < 10 ?  `0${seconds}` : seconds}` : 'En attente des autres participants'} </h6>}
                            </div> 
                        </div>
                    </div>
                    <div className='global-page'>
                    <div className='content-flex-div'>
                        <div className='radar-chart'>
                        <h1 className='negociation-content-titles'>Poids des critères des participants</h1>
                            <div style={{height: '50vh', width: '40vw', margin: 'auto'}}>
                                <Radar className="negoRadar" data={chartData} options={{maintainAspectRatio: false}}/>
                            </div>
                        </div>
                    
                            <div className='leaderboard'>
                            {orderedAlternatives.map((alt, index) => (
                                <>
                                <div className='scenar-list-nego'>
                                    <div>
                                        <h4 style={{fontWeight:`${index === 0 && 'bold'}`, color: '000000', margin: '20px 80px', textAlign: 'center'}}>{`${alt.label} : ${((alt.users.length/participants2.length)*100).toFixed(2)} % `}</h4>
                                    </div>
                                    {/* <div style={{margin: 'auto'}}>
                                    <div style={{backgroundColor: '#fdf4e3', borderRadius: '5px', width: '20vw', margin: 'auto'}}>
                                        <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '20px', color: "#1d334a", textAlign: 'center', margin: '20px 20px'}}>
                                            Liste des participants :
                                        </Typography>
                                        {alt.users.map(userName => (
                                            <h5 style={{color: '#1d334a', textAlign: 'center', margin: '20px 10px'}}>{userName}</h5>
                                            ))}
                                    </div>
                                    </div> */}
                                </div>
                                </>
                            ))}
                            <h1 className='negociation-content-titles'>Classement des scénarios</h1>
                        
                        <div className='criteria-leaderboard'>
                        <h1 className='negociation-content-titles'>Classement des critères</h1>
                        <span className='negociation-content-span'>Du plus au moins polémique</span>
                            {criticalCrit.map((crit, ind) => (
                            <div style={{margin: 'auto', width:'70%',marginBottom:"0.5em",borderRadius:"28px",paddingLeft:"4em",paddingRight:"4em", backgroundColor:`${ind < 6 ? `rgba(230, ${50*ind}, 10, 0.800)` : `rgba(${230 - 40*(ind-5)}, 255, 10, 0.800)`}`}}>
                                <h5 style={{textAlign:'center', wordWrap: 'break-word',  padding: '10px'}}>{data.criteria[crit.pos].label}</h5>
                            </div>
                            ))}
                        </div>
                    </div>
                    </div>
                    </div>
                <div className="negoBottom">
                <div style={{margin: 'auto', display: 'flex', justifyContent: 'space-around', width: '35vw'}}>
                {!specialButton ?             <Button onClick={endNego} variant="contained" style={{backgroundColor:"rgb(241, 207, 12)", margin: 'auto', marginTop: '100px', marginBottom: '100px'}}>
                <EditIcon style={{color:'#1d334a'}} />
                <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "#1d334a"}}>
                    Modifier ses préférences
                </Typography>
            </Button>
                :
                <Button onClick={noConsensus} variant="contained" style={{backgroundColor:"rgb(241, 207, 12)", margin: 'auto', marginTop: '100px', marginBottom: '100px'}}>
                <SentimentVeryDissatisfiedIcon style={{color:'#1d334a'}} />
                <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "#1d334a"}}>
                    Pas de consensus !
                </Typography>
            </Button>}
            <Button onClick={consensus} variant="contained" style={{backgroundColor:"rgb(241, 207, 12)", margin: 'auto', marginTop: '100px', marginBottom: '100px'}}>
                <SentimentVerySatisfiedIcon style={{color:'#1d334a'}} />
                <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "#1d334a"}}>
                    Consensus ! 
                </Typography>
            </Button>
            </div>
            </div> 
            </div> 
        </div>
    </div>
        
    )
}

export default Negociation;

