import React, {useState, useContext, useEffect} from 'react';
import {FirebaseContext} from '../Firebase';
import Criteria from '../Criteria';
import Alternative from '../Alternative';
import Stakeholder from '../Stakeholder';
import { usePage } from '../PageContext';
import { useSessionContext } from '../SessionContext';
import { useCurrentSession } from '../CurrentSessionContext';
import { useHelp } from '../HelpContext';
import explication from '../../images/creaHelp.png';
import { NavLink } from 'react-router-dom';
import Logout from '../Logout';
import undefinedPic from '../../images/undefined.png';
import './creation.css'; 

// For Material UI :
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import RemoveIcon from '@material-ui/icons/Remove';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import DoneIcon from '@material-ui/icons/Done';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

// For Material UI :

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


  // Pagination information :
  
  function getSteps() {
    return ['Informations de la session', 'Définition des critères', 'Définition des scénarios', 'Création des groupes'];
  }
  

  
// Creation of 3 context to share "criteria", "aternatives" and "stakeholders" values anywhere :
/****************************************** */
const CritContext = React.createContext();

const AltContext = React.createContext();

const StHContext = React.createContext();

export function useCritContext() {
    return useContext(CritContext);
}

export function useAltContext() {
    return useContext(AltContext);
}

export function useStHContext() {
    return useContext(StHContext);
}
/******************************************* */

const Creation = (props) => {

    //
    const [preview, setPreview] = useState(undefined);

    const [displayChoose] = useState(false);

    const classes = useStyles();

    // Pagination control :
    /******************************************* */
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();

    const handleNext = () => {
        if (activeStep === steps.length - 1) redirectToRecap();
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    /******************************************** */

    // Update checkbox for the participation of the current user :
    /********************************************* */
    const [checked, setChecked] = useState(false);

    const handleCheckbox = () => {
        setChecked(!checked);
    }
    /********************************************* */

    const firebase = useContext(FirebaseContext);

    const { setCurrentHelp } = useHelp();

    const { setIdCurrentSession } = useCurrentSession();

    const { setCurrentPage } = usePage();

    const { session, setSession } = useSessionContext();

    const [userSession, setUserSession] = useState(null);

    // default values :
    const data = {
        name: "",
        description: "",
        time: 15,
        round: 5,
        groupInit: "1"
    }

    const [sessionData, setSessionData] = useState(data);

    const [sessionData2, setSessionData2] = useState(null);


    // Criteria initialization :
    /************************************************ */
    const [criteriaKey, setCriteriaKey] = useState(3);
    const [criteria, setCriteria] = useState([{id: 1, label: "", goal: false, description: ""}, {id: 2, label: "", goal: false, description: ""}]);

    const value = {
        criteria,
        setCriteria
    }
    /************************************************ */

    //  Alternatives initialization :
    /************************************************ */
    const [alternativeKey, setAlternativeKey] = useState(2);
    const [alternatives, setAlternatives] = useState( [ { id: 1, label: "", description: "", rate: 0, users: [], evaluation: [0, 0] } ] );

    const alternativeValue = {
        alternatives, 
        setAlternatives
    }
    /************************************************* */

    // Stakeholders initialization :
    /************************************************* */
    const [stakeholderKey, setStakeholderKey] = useState(2);
    const [stakeholders, setStakeholders] = useState([{id: 1, label: ""}]);

    const stHValue = {
        stakeholders,
        setStakeholders
    }
    /************************************************** */

    const [userData, setUserData] = useState(null);

    const [displayAddDescription, setDisplayAddDescription] = useState(true);

    // destructuring of general information of the current session :
    const {name, description, time, round, groupInit} = sessionData;

    useEffect(() => {
        setIdCurrentSession(false);
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
            firebase.db.collection("users").doc(userSession.uid).get().then((doc) => {
                setUserData(doc.data());
            });
        }
        if (session !== "") {
            firebase.db.collection("sessions").doc(session).get().then((doc) => {
                if (!doc.exists) return;
                setSessionData(doc.data());
                setSessionData2(doc.data());
            });
        }
    }, [userSession])

    useEffect(() => {
        if (sessionData2 !== null) {
            setCriteria(sessionData2.criteria);
            setAlternatives(sessionData2.alternatives);
            setStakeholders(sessionData2.roles);
            let groupNb = sessionData2.group.length;
            setSessionData({...sessionData, groupInit: groupNb});
        }
    }, [sessionData2])
    
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

    // Update general information of the session :
    const handleChange = (event) => {
        setSessionData({...sessionData, [event.target.id]: event.target.value});
    }


    const addCriteria = (event) => {
        event.preventDefault();
        setCriteriaKey(criteriaKey + 1);
        setCriteria(criteria.concat([{id: criteriaKey, label: "", goal: false, description: ""}]));
        setAlternatives(alternatives.map(function(alt){
            return {...alt, evaluation: alt.evaluation.concat([0])};
        }));
    }

    const addAlternative = (event) => {
        event.preventDefault();
        setAlternativeKey(alternativeKey + 1);
        setAlternatives(alternatives.concat([{id: alternativeKey, label: "", description: "", rate: 0, users: [], evaluation: criteria.map(crit => 0) }]));       
    }

    const addStakeholder = (event) => {
        event.preventDefault();
        setStakeholderKey(stakeholderKey + 1);
        setStakeholders(stakeholders.concat([{id: stakeholderKey, label: ""}]));     
    }

    // Function to make ID session :
    function makeId() {
        var id = "";
        var alphaNum = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 6; i++)
          id += alphaNum.charAt(Math.floor(Math.random() * alphaNum.length));
      
        return id;
    }

    const displayDescription = () => {
        if (displayAddDescription) {
            setDisplayAddDescription(false);
        } else {
            setDisplayAddDescription(true);
            setSessionData({...sessionData, description: ""});
        }
    }

    const redirectToRecap = () => {
        // to save the current session in database :

        // creation of a session id
        let id = makeId();

        let groupArray = [];

        for (let i = 0; i < parseInt(groupInit); i++) {
            groupArray.push(`Groupe ${i+1}`);
        }

        let now = new Date();


        // push this session to the database
        if (session === "") {
            firebase.saveSession(id).set({
                start: Date.parse(new Date()),
                startUpdated: false,
                validations: 0,
                date: "" + now.getDate() + "/" + (now.getMonth()+1) + "/" + now.getFullYear(),
                description: description,
                name: name,
                time: time,
                round: round,
                group: groupArray,
                roles: stakeholders,
                criteria: criteria,
                alternatives: alternatives,
                participants: {[userSession.uid]: {userPseudo: userData.pseudo, userGroup: "", userRole: "", userStage: 0, validatedStage: false, criteriaWeight: criteria.map(crit => {return {label: crit.label, weight: 0}})}},
                owner: userSession.uid,
                generalChannel: [],
                startSession: false,
                checked: checked,
                groupChannel: Object.fromEntries(new Map(groupArray.map(grp => [grp, []])))
            });
            checked && firebase.saveParticipants(id, userSession.uid).set({step: 'R', uid: userSession.uid, userPseudo: userData.pseudo, userGroup: "", userRole: "", userStage: 0, endNego: false, consensus: false, noconsensus: false, validatedStage: false, criteriaWeight: criteria.map(crit => {return {label: crit.label, weight: 0}})});
            let userSessionsUpdated = userData.userSessions;
            userSessionsUpdated.push(id); 
            firebase.saveUserSession(userSession.uid).set({userSessions: userSessionsUpdated}, {merge: true});
        } else {
            let participantsUpdated = [];
            firebase.db.collection(`sessions/${session}/participants`).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    participantsUpdated.push(doc.data().uid);
                });
            });
            for (let i = 0; i < participantsUpdated.length; i++) {
                firebase.db.collection(`sessions/${session}/participants/${participantsUpdated[i]}`).update({
                    criteriaWeight: criteria.map(crit => {return {label: crit.label, weight: 0}})
                })
                .catch((error) => {
                    console.error("Error updating criteria", error);
                });
            }
            firebase.saveSession(session).set({
                checked: checked,
                description: description,
                name: name,
                time: time,
                round: round,
                group: groupArray,
                roles: stakeholders,
                criteria: criteria,
                alternatives: alternatives,
            }, {merge: true});
            setSession("");
            checked && firebase.saveParticipants(session, userSession.uid).set({step: 'R', uid: userSession.uid, userPseudo: userData.pseudo, userGroup: "", userRole: "", userStage: 0, endNego: false, consensus: false, noconsensus: false, validatedStage: false, criteriaWeight: criteria.map(crit => {return {label: crit.label, weight: 0}})});
        }
        // redirect to recap page which contains the session code
        props.history.push("/recap");
    }


    // Field control :
    /******************************************************* */
    let criteriaTest = true;
    let altTest = true;
    let sthTest = true;
    let displayBtn = false;

    if (activeStep === 0) {
        if (name !== "" && time !== "" && round !== "") {
            displayBtn = true;
        }
    } else if (activeStep === 1) {
        criteria.forEach(crit => {
            (crit.label === "") && (criteriaTest = false);
        });
        criteriaTest && (displayBtn = true);
    } else if (activeStep === 2) {
        alternatives.forEach(alt => {
            (alt.label === "") && (altTest = false);
        });
        altTest && (displayBtn = true);
    } else {
        stakeholders.forEach(sth => {
            sth.label === "" && (sthTest = false);
        });
        sthTest && (displayBtn = true);
    }
    /************************************************************ */

    const pagination = <div className={classes.root}>
    <Stepper activeStep={activeStep} alternativeLabel style={{backgroundColor: '#ffffff'}}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  </div>

    
    const btnLeftRight = <div className='prec-next-button-before' style={{margin: 'auto',"&:hover": {
        transition:"0.8s",
        color:"yellow",
    },}}>
    <div className='prec-next-button'>
      <Button
        disabled={activeStep === 0}
        onClick={handleBack}
        className={classes.backButton}
        style={{backgroundColor: 'rgb(33, 68, 191)' , marginTop: '100px', marginBottom: '100px'}}
      >
        <ChevronLeftIcon style={{color:'white'}}/>
        <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px',"&:hover": {
                                        transition:"0.8s",
                                        color:"yellow",
                                    },}}>
            Précédent
        </Typography>
      </Button>
      <Button variant="contained" style={{backgroundColor: `${activeStep === steps.length - 1 ? '#49D009' : 'rgb(33, 68, 191)'}`, marginTop: '2px', marginBottom: '2px'}} onClick={handleNext} disabled={!displayBtn}>
        {activeStep === steps.length - 1 ? <><DoneIcon style={{color: 'white'}}/><Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "white"}}>
            Valider
        </Typography></> : <><Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', "&:hover": {
                                        transition:"0.8s",
                                        color:"yellow",
                                    },}}>
            Suivant
        </Typography><ChevronRightIcon style={{color: 'white'}}/></>}
      </Button>
    </div>
  </div>


    if (userSession === null) { 
        return (<div className="loading"><div className="d-flex align-items-center">
        <strong>Loading ...</strong>
        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
      </div></div>)}
    else if (activeStep === 0) {
        return (
            <div className="creationDesign">
                <header className="header">

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
                {pagination}
                <form style={{marginTop: '30px'}}>
                    <div className="head">
                        <div className="content-and-pagination">
                        <div className="create-session-content"> 
                            <h1 className='session-name'>Nom de la session</h1>
                            <TextField onChange={handleChange} value={name} id="name" label="Nom de la session" variant="filled" style={{backgroundColor: "#fdf4e3", margin: '20px 60px', borderRadius: '5px'}}/>
                            {displayAddDescription ?
                            <Button className='add-desc' onClick={displayDescription} variant="contained" style={{backgroundColor:"#2144BF"}}>
                            <AddIcon style={{color: 'white'}} />
                            <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "white"}}>
                                Ajouter une description
                            </Typography>
                            </Button> 
                            : 
                            <Button onClick={displayDescription} variant="contained" style={{backgroundColor:"#2144BF"}}>
                            <RemoveIcon />
                            <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "white"}}>
                                Retirer la description
                            </Typography>
                            </Button>
                            }
                            {!displayAddDescription &&
                                <TextField
                                    style={{backgroundColor: "white", margin: '1em 4em', borderRadius: '5px'}}
                                    onChange={handleChange}
                                    value={description}
                                    id="description"
                                    label="Description de la session"
                                    multiline
                                    variant="filled"
                                />
                            }
                            <h1 className='session-name'>Temps par tour (En minutes)</h1>
                            <TextField
                            style={{margin: '0px 4em', borderRadius: '5px'}}
                            onChange={handleChange}
                            value={time}
                            id="time"
                            label="Temps par tour (minutes)"
                            type="number"
                            InputProps={{
                                inputProps: { 
                                    max: 600, min: 1 
                                }
                            }}
                            />
                            <h1 className='session-name'>Nombre de tours</h1>
                            <TextField
                            style={{margin: '0px 4em', borderRadius: '5px'}}
                            onChange={handleChange}
                            value={round}
                            id="round"
                            label="Nombre de tours"
                            type="number"
                            InputProps={{
                                inputProps: { 
                                    max: 30, min: 2 
                                }
                            }}
                            />
                        </div>
                        {btnLeftRight}
                        </div>
                    </div>
                </form> 
            </div>
        )
    } else if (activeStep === 1) {
        return (
            <div className="def-criteria">
            <header className="header">

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
            {pagination}
            <form style={{marginTop: '30px'}}>
                 
                <div className="head">
                    <div className="content-and-pagination-step2"> 
                    <AltContext.Provider value={alternativeValue}>
                    <CritContext.Provider value={value}>
                    
                    <div>
                    <div style={{margin: 'auto'}}>
                        {criteria.map((item, index) => (
                            <div className='criteria-1by1'>
                                <Criteria key={item.id} criteria={criteria} index={index} />
                                <br/>
                            </div>    
                        ))}
                        </div>            
                    </div>
                
                    </CritContext.Provider>
                    </AltContext.Provider>
                    
                </div>
                </div>
            </form>
            <div className='add-criteria-button'>
                    <Button onClick={addCriteria} variant="contained" style={{backgroundColor:"#2144BF", margin: 'auto'}}>
                            <AddIcon style={{"&:hover": {
                                        transition:"0.8s",
                                        color:"yellow",
                                    },}} />
                            <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px',"&:hover": {
                                        transition:"0.8s",
                                        color:"yellow",
                                    },}}>
                                Ajouter un critère
                            </Typography>
                            </Button> 
            </div>
            <div>


            </div>
            <div className='pagination-step2'>{btnLeftRight}</div>
            </div>
        )
    } else if (activeStep === 2) {
        return (
            <div className="def-scenario">
                <header className="header">

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
                {pagination}
            <form style={{marginTop: '30px'}}>  
                <div className="head">
                    <AltContext.Provider value={alternativeValue}>  
                    <div style={{margin: 'auto'}}>
                            {alternatives.map((item, index) => (
                                <div>
                                    <Alternative key={item.id} criteria={criteria} num={index}/>
                                    <br/>
                                </div>
                            ))}
                    </div>
                    <div className='add-scenario-button'>
                    <Button onClick={addAlternative} variant="contained" style={{backgroundColor:"#2144BF", margin: 'auto'}}>
                        <AddIcon style={{color:'white'}} />
                        <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px',"&:hover": {
                            color: "yellow",
                            transition:'0.5s',
                            }, }}>
                            Ajouter un scénario
                        </Typography>
                    </Button> 
                    </div>
                    </AltContext.Provider>
                </div>
            </form>
            <div className='pagination-step2'>
            {btnLeftRight}
            </div>
            </div>
        )
    } else {
        return (
            <div className="creationDesign">
                <header className="header">

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
                {pagination}
                <form style={{marginTop: '30px'}}>  
                    <div className="head">
                        <div className="nvStakeholders">
                        <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '20px', color: "black", textAlign: 'center', marginTop: '20px'}}>
                            <strong>Nombre de groupes :</strong>
                        </Typography>
                            <TextField
                            style={{backgroundColor: "transparent", margin: '20px 180px', borderRadius: '5px'}}
                            onChange={handleChange}
                            value={groupInit}
                            id="groupInit"
                            label="Nombre de groupes"
                            type="number"
                            min="1"
                            max="50"
                            />
                        </div>
                            <StHContext.Provider value={stHValue}>
                                <div style={{margin: 'auto',width:"90%"}}>
                                    <div style={{margin: '25px 45px', backgroundColor: '#EBE9E9', borderRadius: '10px'}}>
                                        <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '20px', color: "black", textAlign: 'center'}}>
                                            <strong>Définition des rôles</strong>
                                        </Typography>
                                        {stakeholders.map((item, index) => (
                                            <Stakeholder key={item.id} index={index} />
                                        ))}
                                        <br/>
                                    </div>
                                </div>
                                <Button onClick={addStakeholder} variant="contained" style={{backgroundColor:"#2144BF", margin: 'auto', marginBottom: '10px', marginTop: '10px'}}>
                                        <AddIcon style={{color:'white'}} />
                                        <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "white"}}>
                                            Ajouter un rôle
                                        </Typography>
                                </Button>
                            </StHContext.Provider>
                        <div style={{margin: 'auto'}}>
                            
                        </div>
                    </div> 
                </form>
                <div className='checkbox-session'>
                <FormControlLabel
                                control={<Checkbox checked={checked} onChange={handleCheckbox} name="checkedG" style={{color: "#f39f18", textAlign: 'center'}} />}
                                label="Participer à la session"
                            />
                </div>

                <div className='pagination-step2'>
                {btnLeftRight}
                </div>
            </div>
        )
    }

}

export default Creation;
