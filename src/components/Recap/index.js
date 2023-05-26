import React, { useState, useEffect, useContext, Fragment } from 'react';
import { FirebaseContext } from '../Firebase';
import { usePage } from '../PageContext';
import { useCurrentSession } from '../CurrentSessionContext';
import { useSessionContext } from '../SessionContext';
import copy from "copy-to-clipboard";
import { useHelp } from '../HelpContext';
import explication from '../../images/recapHelp.png';
import { NavLink } from 'react-router-dom';
import Logout from '../Logout';
import undefinedPic from '../../images/undefined.png';
import './recap.css';

// Material UI :
/************************************************************* */
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CreateIcon from '@material-ui/icons/Create';
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import TimerIcon from '@material-ui/icons/Timer';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import CallMadeIcon from '@material-ui/icons/CallMade';
import VisibilityIcon from '@material-ui/icons/Visibility';


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
/******************************************************************* */



const Recap = (props) => {

    const [preview, setPreview] = useState(undefined);

    const classes = useStyles();

    const firebase = useContext(FirebaseContext);

    const { setCurrentHelp } = useHelp();

    const { setIdCurrentSession } = useCurrentSession();

    const { setCurrentPage } = usePage();

    const { setSession } = useSessionContext();

    const [userSession, setUserSession] = useState(null);

    const [startSession, setStartSession] = useState(false);

    const [displayChoose] = useState(false);

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
        checked: false
    }

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
    

    // id session recovery 
    useEffect(() => {
        if (userSession) {
            let unsubscribe2 = (userSession !== null) && firebase.db.collection("users").doc(userSession.uid).onSnapshot((doc => {
                if (!doc.exists) return;
                setIdSession(doc.data().userSessions[doc.data().userSessions.length-1]);
            })); 
            return () => {
                unsubscribe2();
            }
        }
    }, [userSession])


    // Session data recovery on firestore
    useEffect(() => {
        if (idSession !== ""){
            let unsubscribe = firebase.db.collection("sessions").doc(idSession).onSnapshot((doc) => {
                if (!doc.exists) return;
                setData(doc.data());
                setStartSession(doc.data().startSession);
            });
            return () => {
                unsubscribe();
            }
        }
    }, [idSession])


    // redirect to selection page if the session has started
    useEffect(() => {
        if (startSession) {
            if (userSession.uid === owner) {
                if (checked) {
                    firebase.saveParticipants(idSession, userSession.uid).set({step: 'S'}, {merge: true});
                    props.history.push("/selection");
                }
            } else {
                firebase.saveParticipants(idSession, userSession.uid).set({step: 'S'}, {merge: true});
                props.history.push("/selection");
            }
        }
    }, [startSession])

    // destructuring of the session data
    const { alternatives, criteria, description, owner, round, time, checked } = data;

    // Function to start the session 
    const onClick2 = () => {
        firebase.saveSession(idSession).set({startSession: true}, {merge: true});
    }

    // Funciton to modify the session
    const handleReturnClick = () => {
        setSession(idSession);
        props.history.push("/creation");
    }

    return userSession === null ? 
        (<div className="loading"><div className="d-flex align-items-center">
            <strong>Loading ...</strong>
        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
      </div></div>)
    :
    (<><header className="header">

    <nav className="navbar-global-connected">
      <div className="app-title-connected">
        <h1 className='consensus-title-connected'>ConsensUs</h1><style>@import url('https://fonts.googleapis.com/css2?family=Palanquin+Dark:wght@400;500;700&display=swap');</style>
        <div className="navbar-subtitle-connected">
          <NavLink className="home-link-nav-connected" to="login">Accueil</NavLink>
          <NavLink className="about-link-nav-connected" to="aboutConnected">A propos</NavLink>
          <NavLink className="help-link-nav-connected" to="help">Aide</NavLink>
          
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
  
  <div className="recap-content">
        
            <h1 className='slogan'>{owner === userSession.uid ? "Récapitulatif de la session" : "Bienvenue sur la session"}</h1>
        
            <div className='First-recap-part'>
            <h3 className='nb-rounds'>
                        <strong>{`Nombre de tours : ${round}`}</strong>
            </h3>   
                <div className='session-code-and-copy-session'>
            <h3 className='code-title'>Code de la session :</h3>
            <div className='copycode'><span className='code'>{idSession}</span><IconButton
                onClick={() => copy(idSession)}
                style={{borderRadius: '5px', color: '#1d334a', backgroundColor: 'rgb(241, 207, 12)', height: '40px', margin: 'auto'}}
            >
                <FileCopyIcon />
            </IconButton></div>
                </div>
                <h3 className='timer'>
                        <TimerIcon/>
                        <strong>{` Temps global : ${parseInt(time)*round} min`}</strong>
                </h3>
            </div>
        <div className="2nd-part">
            {owner === userSession.uid ? 
            <Fragment>
                <div className='session-description-div-recap'>
                    <span className='desc-session-span'><strong>Description de la session</strong></span>
                    <span className='session-desc-recap'>{description}</span>
                </div>        
                <div className="recapCriteria">
                    <div className='criteria-and-title'>
                    <h2 className='crit-title'>Les critères</h2>
                    <div className="criteria-recap">
                    {criteria && criteria.map((crit, index) => (
                        <>
                            <div key={index} style={{backgroundColor: '#EBE9E9', borderRadius: '5px', margin: '20px 120px'}}>
                                <div className="recapCriteriaDescription">

                                    <div className='crits-recap' style={{wordWrap: 'break-word', width: '20vw',color: '#000000'}}>
                                        <span className='spanRecap'>{`Critère ${++index} : ${crit.label}`}</span>
                                    </div>
                                    
                                    <div className='crits-recap' style={{wordWrap: 'break-word', textAlign: 'justify', width: '20vw', color: '#000000'}}>

                                    <span className='spanRecap'>{(crit.description !== "") && "Description : " + crit.description}</span>

                                </div>
                                </div>
                                <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "#000000", textAlign: 'justify',marginTop:"0.2em",marginBottom:"0.2em"}}>
                                    <span className='spanRecap'>{crit.goal === false ? <>Objectif : minimiser <CallReceivedIcon style={{color: '#000000'}}/></> : <>Objectif : maximiser <CallMadeIcon style={{color: '#000000'}}/></>}</span>
                                </Typography>
                            </div>
                        </>
                    ))}
                </div>
                </div>
                <div className="scenar-and-title">
                    <h2 className='scenar-title'>Les scénarios</h2>
                    <div className="scenario">
                {alternatives && alternatives.map((alt, index) => (
                    <>
                        <div key={index} style={{backgroundColor: '#EBE9E9', borderRadius: '5px', margin: '20px 120px'}}>
                            <div className="recapAlternativesDescription">
                                <div className='scenars-recap' style={{wordWrap: 'break-word', width: '20vw',  color: '#000000'}}>
                                    <span className='spanRecap'>{`Scénario ${++index} : ${alt.label}`}</span>
                                </div>
                                <div className='scenars-recap' style={{wordWrap: 'break-word', width: '20vw', color: '#000000'}}>
                                    <span className='spanRecap'> {(alt.description !== "") && "Description : " + alt.description}</span>
                                </div>
                            </div>
                        </div>
                       
                    </>
                ))}  
                    </div>
                    </div>
                    </div>
                <div style={{width: '35vw', display: 'flex', justifyContent: 'space-around', margin: '20px', marginRight: 'auto', marginLeft: 'auto'}}>
                    { (owner === userSession.uid) &&
                    <Button onClick={handleReturnClick} variant="contained" style={{minWidth:"150px",backgroundColor:"rgb(241, 207, 12)",marginRight:"2em",marginLeft:"2em"  ,marginTop: '100px', marginBottom: '100px',width:'200px'}}>
                    <CreateIcon style={{color:'#1d334a'}} />
                    <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "#1d334a"}}>
                        Modifier la session
                    </Typography>
                    </Button>}  
                    {owner === userSession.uid && !startSession &&
                    <Button onClick={onClick2} variant="contained" style={{minWidth:"150px",backgroundColor:"rgb(241, 207, 12)", margin: 'auto', marginTop: '100px', marginBottom: '100px',width:'200px'}}>
                    <PlayArrowIcon style={{color:'#1d334a'}} />
                    <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "#1d334a"}}>
                        Lancer la session
                    </Typography>
                    </Button>}
                    {!checked && startSession && <Button onClick={() => props.history.push("/consensus")} variant="contained" style={{minWidth:"150px",backgroundColor:"rgb(241, 207, 12)", margin: 'auto', marginTop: '100px', marginBottom: '100px',width:'200px'}}>
                    <VisibilityIcon style={{color:'#1d334a'}} />
                    <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "#1d334a"}}>
                        Observer la session
                    </Typography>
                    </Button>}
                </div>
            </Fragment>
            : 
            <Fragment>
                <div className="recapDescription">
                    <h2>{description}</h2>
                </div>
                <div className="loadingRecap">
                    <div className="d-flex align-items-center">
                        <strong>En attente du lancement de la session ...</strong>
                        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                    </div>
                </div>
            </Fragment>
            }
        </div>  
</div></>
);
}

export default Recap;
