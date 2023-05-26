import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../Firebase';
import { usePage } from '../PageContext';
import { useCurrentSession } from '../CurrentSessionContext';
import { useHelp } from '../HelpContext';
import explication from '../../images/selectionHelp.png';
import { NavLink } from 'react-router-dom';
import undefinedPic from '../../images/undefined.png';
import Logout from '../Logout';
import "./selection.css";

// Material UI :
/****************************************************** */
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';


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
/*********************************************************** */



const Selection = (props) => {

  

    const classes = useStyles();

    const firebase = useContext(FirebaseContext);

    const { setCurrentHelp } = useHelp();

    const { setIdCurrentSession } = useCurrentSession();

    const { setCurrentPage } = usePage();

    const [userSession, setUserSession] = useState(null);

    const [totalParticipants, setTotalParticipants] = useState([]);

    const [startIndividualDecision, setStartIndividualDecision] = useState(false);

    const [editable, setEditable] = useState(true);

    const [participantCounter, setParticipantCounter] = useState(0);


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
        time: 15
    }

    const [data, setData] = useState(initialData);

    const [idSession, setIdSession] = useState("");

    const [selection, setSelection] = useState({
        selectGroup: "Groupe 1",
        selectRole: ""
    });

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
            let unsubscribe2 = (userSession !== null) && firebase.db.collection("users").doc(userSession.uid).onSnapshot((doc => {
                if (!doc.exists) return;
                setIdSession(doc.data().userSessions[doc.data().userSessions.length-1]);
            })); 
            return () => {
                unsubscribe2();
            }
        }
    }, [userSession])


    useEffect(() => {
        if (idSession !== ""){
            let unsubscribe = firebase.db.collection("sessions").doc(idSession).onSnapshot((doc) => {
                if (!doc.exists) return;
                setData(doc.data());
            });
            return () => {
                unsubscribe();
            }
        }
    }, [idSession])


    useEffect(() => {
        if (idSession !== "") {
            let unsubscribe = firebase.db.collection(`sessions/${idSession}/participants`).onSnapshot((querySnapshot) => {
                let participantsUpdated = [];
                querySnapshot.forEach((doc) => {
                    participantsUpdated.push(doc.data());
                });
                setTotalParticipants(participantsUpdated);
            });
            return () => {
                unsubscribe();
            }
        }
    }, [idSession])


    useEffect(() => {
        let startIndividualDecisionUpdated = true;
        let participantCounterUpdated = 0;
        for (let i = 0; i < totalParticipants.length; i++) {
            if (totalParticipants[i].userGroup === "") {
                startIndividualDecisionUpdated = false;
                participantCounterUpdated = participantCounterUpdated + 1;
            }
        }
        setParticipantCounter(participantCounterUpdated);
        setStartIndividualDecision(startIndividualDecisionUpdated);
    }, [totalParticipants])


    useEffect(() => {
        if (startIndividualDecision && userSession) {
            firebase.saveParticipants(idSession, userSession.uid).set({step: 'D', validatedStage: false, userGroup: selection.selectGroup, userRole: selection.selectRole === "" ? data.roles[0].label : selection.selectRole}, {merge: true});
            props.history.push('/individualDecision');
        }
    }, [startIndividualDecision])


    const { group, roles } = data;

    const handleChangeGroup = e => {
        setSelection({...selection, selectGroup: e.target.value});
    }

    const handleChangeRole = e => {
        setSelection({...selection, selectRole: e.target.value});
    }


    function onClick() {
        setEditable(false);
        firebase.saveParticipants(idSession, userSession.uid).set({validatedStage: false, userGroup: selection.selectGroup, userRole: selection.selectRole === "" ? data.roles[0].label : selection.selectRole}, {merge: true});
    }

      /*================= Avatar =====================*/
      useEffect(() => {
        userSession &&
        firebase.db.collection("users").doc(userSession.uid).get().then((doc) => {
            setUserData(doc.data());
          });
    }, [userSession])

    const [setUserData] = useState(null);

    const [displayChoose] = useState(false);

    const [preview, setPreview] = useState(undefined);

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

    /*=========================================*/

    return (<><header className="header">
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
        <div className="selection-content">
            
                <h1 className='slogan-bis'>La session va bientôt démarrer.</h1>
                <h1 className='slogan-bis2'>Veuillez choisir votre groupe et votre rôle</h1>
                
                <div className="selection">
                    <div className="selection1">
                    <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '20px', color: "#000000", textAlign: 'center', marginTop: '20px'}}>
                        <span className='selection1-span'>Choisissez votre groupe :</span>
                    </Typography>
                    <FormControl variant="filled" className={classes.formControl} style={{backgroundColor: '#ffffff', margin: '20px 120px', width:"150px"}}>
                        <InputLabel id="demo-simple-select-filled-label">Groupe</InputLabel>
                        <Select
                        labelId="demo-simple-select-filled-label"
                        id="selectGroup"
                        value={selection.selectGroup}
                        onChange={handleChangeGroup}
                        disabled={!editable}
                        style={{backgroundColor: '#ffffff'}}
                        >
                        {group && group.map((gr, ind) => (
                            <MenuItem value={gr} key={ind}>{gr}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    </div>
                    <div className="selection2">

                    <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '20px', color: "#000000", textAlign: 'center', marginTop: '20px'}}>
                        <span className='selection2-span'>Choisissez votre rôle :</span>
                    </Typography>
                    <FormControl variant="filled" className={classes.formControl} style={{backgroundColor: '#ffffff', margin: '20px 120px', width: '150px'}}>
                        <InputLabel id="demo-simple-select-filled-label">Rôle</InputLabel>
                        <Select
                        labelId="demo-simple-select-filled-label"
                        id="selectRole"
                        value={selection.selectRole}
                        onChange={handleChangeRole}
                        disabled={!editable}
                        style={{backgroundColor: '#ffffff'}}
                        >
                        {roles && roles.map((role, ind) => (
                            <MenuItem value={role.label} key={ind}>{role.label}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    </div>
                </div>
            <div style={{margin: 'auto', display: 'flex', justifyContent: 'space-between', width: '30vw'}}>
                {
                editable ? 
                <Button onClick={onClick} disabled={selection.selectRole === ""} variant="contained" style={{backgroundColor:"#2144BF", margin: 'auto', marginTop: '30px'}}>
                    <DoneIcon style={{color:'#ffffff'}} />
                    <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "#ffffff",width:"150px"}}>
                        <span className='ValidButton'>Valider</span>
                    </Typography>
                </Button>
                :
                <div style={{display: 'flex', flexDirection: 'column', margin: 'auto', width: '30vw'}}>
                    <div className="d-flex align-items-center" style={{display: 'flex', margin: 'auto', marginTop: '10px', justifyContent: 'space-between'}}>
                <h3 style={{color: '#1d334a', textAlign: 'center'}}>{participantCounter > 1 ? `En attente de ${participantCounter} participants` : `En attente de ${participantCounter} participant`}</h3>
                <div className="spinner-border ms-auto" role="status" aria-hidden="true" style={{marginLeft: '40px'}}></div>
            </div>
            <Button onClick={() => setEditable(true)} variant="contained" style={{backgroundColor:"rgb(241, 207, 12)", margin: 'auto', marginTop: '30px'}}>
                <EditIcon style={{color:'#1d334a'}} />
                <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "#1d334a"}}>
                    Modifier
                </Typography>
            </Button>
            </div>
            }
        </div>
        </div>
    </>)
}
    
export default Selection;
