import React, {useState, useContext, useEffect} from 'react';
import {FirebaseContext} from '../Firebase';
import plane from '../../images/plane.svg';






// For Material UI :
/******************************************* */
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import ChatIcon from '@material-ui/icons/Chat';
import Badge from '@material-ui/core/Badge';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});
/******************************************** */

export default function TemporaryDrawer(props) {

    const classes = useStyles();
    const [state, setState] = React.useState({
      top: false,
      left: false,
      bottom: false,
      right: false,
    });


    const firebase = useContext(FirebaseContext);

    const [userSession, setUserSession] = useState(null);

    const [idSession, setIdSession] = useState("");

    const [selection, setSelection] = useState('0');


    // All informations about participants :
    /******************************************** */
    const [pseudo, setPseudo] = useState("");

    const [messages, setMessages] = useState([]);

    const [groupMessages, setGroupMessages] = useState([]);

    const [participants2, setParticipants2] = useState([]);

    const [totalParticipants, setTotalParticipants] = useState([]);

    const [userGroup, setUserGroup] = useState("");

    const [notif, setNotif] = useState(false);

    const [avatar, setAvatar] = useState([]);

    const [totalAvatar, setTotalAvatar] = useState([]);

    const [uids2, setUids2] = useState([]);

    const [uidsTotal, setUidsTotal] = useState([]);
    /************************************************** */

    
    // general informations of the session :
    const initialData = {
        alternatives: {},
        criteria: {},
        description: "",
        group: [],
        roles: [],
        name: "",
        owner: "",
        participants: {},
        round: 5,
        time: 15,
        generalChannel: [],
        groupChannel: {}
    }

    const [data, setData] = useState(initialData);

    useEffect(() => {
        let listener = firebase.auth.onAuthStateChanged(user => {
            user ? setUserSession(user) : props.history.push("/");
        });
        return () => {
            listener()
        };
    }, [])

    useEffect(() => {
        const userSessionRef = (userSession !== null) && firebase.db.collection("users").doc(userSession.uid);
        userSessionRef &&
        userSessionRef.get().then((doc) => {
            if (!doc.exists) return;
            setIdSession(doc.data().userSessions[doc.data().userSessions.length-1]);
            setPseudo(doc.data().pseudo);
            setAvatar(doc.data().avatar);
        })
    }, [userSession],[])

    // Update of participants and messages :
    useEffect(() => {
        if (idSession !== ""){
            firebase.db.collection("sessions").doc(idSession).onSnapshot((doc) => {
                if (!doc.exists) return;
                setData(doc.data());
            });
            firebase.db.collection(`sessions/${idSession}/messages`).orderBy("temps").onSnapshot((querySnapshot) => {
                let messagesUpdated = [];
                querySnapshot.forEach((doc) => {
                    messagesUpdated.push(doc.data());
                });
                messagesUpdated.sort(function compare(a, b) {
                    if (a.temps < b.temps)
                       return -1;
                    if (a.temps > b.temps)
                       return 1;
                    return 0;
                  });
                if ((messages.length !== messagesUpdated.length) && (activeTab === "participants")) {
                    setNotif(true);
                } 
                setMessages(messagesUpdated);
            });
            let userRef = (userSession !== null) && firebase.db.collection(`sessions/${idSession}/participants`).doc(userSession.uid).onSnapshot((doc) => {
                if (!doc.exists) return;
                setUserGroup(doc.data().userGroup);
            })
            return () => {
                userRef();
            }
        }
    }, [idSession],[])


    // Update of participants and messages :
    useEffect(() => {
        if (userGroup !== "") {
            let unsubscribe2 = firebase.db.collection(`sessions/${idSession}/participants`).where("userGroup", "==", userGroup).onSnapshot((querySnapshot) => {
                let participantsUpdated = [];
                let uidsUpdated = [];
                querySnapshot.forEach((doc) => {
                    participantsUpdated.push(doc.data());
                    uidsUpdated.push(doc.data().uid);
                });
                setParticipants2(participantsUpdated);
                setUids2(uidsUpdated);
            });
            let unsubscribe3 = firebase.db.collection(`sessions/${idSession}/participants`).onSnapshot((querySnapshot) => {
                let uidsUpdated = [];
                let participantsUpdated = [];
                querySnapshot.forEach((doc) => {
                    participantsUpdated.push(doc.data());
                    uidsUpdated.push(doc.data().uid);
                });
                setTotalParticipants(participantsUpdated);
                setUidsTotal(uidsUpdated);
            });
            firebase.db.collection(`sessions/${idSession}/groups/${userGroup}/messages`).orderBy("temps").onSnapshot((querySnapshot) => {
                let messagesUpdated = [];
                querySnapshot.forEach((doc) => {
                    messagesUpdated.push(doc.data());
                });
                messagesUpdated.sort(function compare(a, b) {
                    if (a.temps < b.temps)
                    return -1;
                    if (a.temps > b.temps)
                    return 1;
                    return 0;
                });
                if ((groupMessages.length !== messagesUpdated.length) && (activeTab === "participants")) {
                    setNotif(true);
                }
                setGroupMessages(messagesUpdated);
            });
            return () => {
                unsubscribe2();
                unsubscribe3();
            }
        }
    }, [userGroup])

    useEffect(() => {
        let avatarUpdated = [];
        uids2.map(uid => {
            firebase.db.collection("users").doc(uid).get().then((doc) => {
                avatarUpdated.push(doc.data().avatar)
            });
        });
        setAvatar(avatarUpdated);

        let avatarTotalUpdated = [];
        uidsTotal.map(uid => {
            firebase.db.collection("users").doc(uid).get().then((doc) => {
                avatarTotalUpdated.push(doc.data().avatar)
            });
        });
        setTotalAvatar(avatarTotalUpdated);
    }, [uids2, uidsTotal])

    // default value :

    const [message, setMessage] = useState("");

    const [activeTab, setActiveTab] = useState("participants");

    const changeToChat = () => {
        setActiveTab("chat");
        setNotif(false);
    }

    const changeToParticipants = () => {
        setActiveTab("participants");
    }

    // Function to update the message :
    const handleChange = (e) => {
        e.preventDefault();
        setMessage(e.target.value);
    }

    // Function to generate a random ID to record a message in firestore :
    function makeId() {
        var id = "";
        var alphaNum = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 24; i++)
          id += alphaNum.charAt(Math.floor(Math.random() * alphaNum.length));
      
        return id;
    }

    // Function to send a message : 
    const handleClick = (e) => {
            if (e.target.id === "plane" || e.key === "Enter") {
                setMessage("");
                if (selection === '0') {
                    firebase.saveMessages(idSession, makeId()).set({uid: userSession.uid, pseudo: pseudo, message: message, temps: Date.parse(new Date())});
                } else {
                    if (userGroup !== "") {
                        firebase.saveGroupMessages(idSession, userGroup, makeId()).set({uid: userSession.uid, pseudo: pseudo, message: message, temps: Date.parse(new Date())});
                    }
                }
                e.preventDefault();
            }
    }

    function nbre_caracteres(lettre,mot)
    {
        mot = mot.split('');
        var nbre_de_fois_trouve = 0;
        for(var i = 0; i < mot.length; i++)
        {
            if(lettre == mot[i])
                nbre_de_fois_trouve++;
        }
        return nbre_de_fois_trouve;
    }

    const handleSelection = e => {
        setSelection(e.target.value);
    }

    // Function to view the latest messages :
    useEffect(() => {
        let chat = document.getElementById("chatArea");
        if (chat !== null) chat.scrollTop = chat.scrollHeight;
    }, [data.generalChannel])

    const displayTab = (activeTab === "chat") ? 
    <div className="zoneDuChat">
                 <div style={{display:'flex', flexDirection: 'column', backgroundColor: '#2271b3', justifyContent: 'space-around'}}>
                <h4 style={{textAlign: 'center', color: '#ffffff', fontSize: '20px'}}>Sélectionnez le chat : </h4>
                
                <FormControl variant="filled" className={classes.formControl} style={{backgroundColor: '#fdf4e3', width: '10vw', margin: 'auto', marginBottom: '2vh'}}>
                    <InputLabel id="demo-simple-select-filled-label">Groupe</InputLabel>
                    <Select
                    labelId="demo-simple-select-filled-label"
                    onChange={handleSelection}
                    style={{backgroundColor: '#ffffff'}}
                    >
                    <MenuItem value={"0"}>Général</MenuItem>
                    <MenuItem value={"1"}>Mon groupe</MenuItem>
                    </Select>
                </FormControl>
                </div>
               
<div className="messagesArea" id="chatArea">
    {selection === '0' ? messages.map(mes => {
            return (
            <div className={(mes.uid === userSession.uid)? "messagePosition2" : "messagePosition1"}>
                <h6 className={(mes.uid === userSession.uid)? "messagePseudo2" : "messagePseudo1"}>{mes.pseudo}</h6>
                <textarea value={mes.message} className={(mes.uid === userSession.uid)? "currentUserSingleMessage" : "singleMessage" } 
                    style={{height:`${(mes.message.length % 27 > 0) ? 
                    (mes.message.length + 27 - (mes.message.length % 27) - 
                    (nbre_caracteres("l", mes.message) * 0.6) - 
                    (nbre_caracteres("i", mes.message) * 0.6) - 
                    (nbre_caracteres("f", mes.message) * 0.5)) * 0.1 
                    : mes.message.length * 0.1}vh`}} disabled="true"/>
            </div>
            )
    }) : groupMessages.map(mes => {
        return (
        <div className={(mes.uid === userSession.uid)? "messagePosition2" : "messagePosition1"}>
            <h6 className={(mes.uid === userSession.uid)? "messagePseudo2" : "messagePseudo1"}>{mes.pseudo}</h6>
            <textarea value={mes.message} className={(mes.uid === userSession.uid)? "currentUserSingleMessage" : "singleMessage" } 
                style={{height:`${(mes.message.length % 27 > 0) ? 
                (mes.message.length + 27 - (mes.message.length % 27) - 
                (nbre_caracteres("l", mes.message) * 0.6) - 
                (nbre_caracteres("i", mes.message) * 0.6) - 
                (nbre_caracteres("f", mes.message) * 0.5)) * 0.1 
                : mes.message.length * 0.1}vh`}} disabled="true"/>
        </div>
        )
})}
</div>
<div className="chatTextArea">
    <textarea onChange={handleChange} onKeyPress={handleClick} value={message} className="textArea" id="message" autoComplete="off" required placeholder="Ecrivez un message ..."/>
    <div className="planeImgContainer">
        <img className="planeImg" onClick={handleClick} src={plane} id="plane" alt=""/>
    </div>
    </div>
</div>
: 
<div className="participantsArea">
<div style={{display:'flex', flexDirection: 'column', backgroundColor: '#2271b3', justifyContent: 'space-around'}}>
                <h4 style={{textAlign: 'center', color: '#ffffff', fontSize: '20px'}}>Sélectionnez le groupe : </h4>
                
                <FormControl variant="filled" className={classes.formControl} style={{backgroundColor: '#fdf4e3', width: '10vw', margin: 'auto', marginBottom: '2vh'}}>
                    <InputLabel id="demo-simple-select-filled-label">Groupe</InputLabel>
                    <Select
                    labelId="demo-simple-select-filled-label"
                    onChange={handleSelection}
                    style={{backgroundColor: '#ffffff'}}
                    >
                    <MenuItem value={"0"}>Général</MenuItem>
                    <MenuItem value={"1"}>Mon groupe</MenuItem>
                    </Select>
                </FormControl>
                </div>
    <div className="stepInfs">
        <h6 style={{color:'#ffffff'}}>R : page de récapitulatif</h6>
        <h6 style={{color:'#ffffff'}}>S : page de sélection</h6>
        <h6 style={{color:'#ffffff'}}>D : page de décision individuelle</h6>
        <h6 style={{paddingBottom: '2vh', color:'#ffffff'}}>N : page de négociation</h6>
    </div>
    <h6 style={{color: '#1d334a', textAlign: 'center', fontSize: '20px'}}>Liste des participants</h6>
    <div style={{overflowY: 'scroll', height: '72vh'}}>
    {(selection === '0') ? totalParticipants.map((p, ind) => (
        <>
            <br/>
        <div className="participant">
            <div style={{display: 'flex', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'space-between', width: '12vw'}}>
            <div style={{display: 'flex', justifyContent:'space-between', width: '100px', marginTop: '5px'}}>
            {totalAvatar[ind] !== undefined && <img style={{height:'40px', width:'40px', margin: 'auto'}} src={totalAvatar[ind]} alt="Preview" />}
            <h6 style={{color: '#ffffff', marginTop: '5px'}}>{p.userPseudo}</h6>
            </div>
            <h6 style={{backgroundColor: '#ffffff', width: `20px`, marginTop: '0.5vh', height:'20px', borderRadius: '20px', textAlign: "center", color: '#1d334a', marginRight: '5px'}} >{p.step}</h6>
            </div>
            <h6 style={{textAlign: 'center', color: '#ffffff'}}>{`rôle : ${p.userRole}`}</h6>
        </div>
        </>
    ))
    :
    participants2.map((p, ind) => (
        <>
            <br/>
            <div className="participant">
            <div style={{display: 'flex', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'space-around', width: '12vw'}}>
            <div style={{display: 'flex', justifyContent:'space-between', width: '100px', marginTop: '5px'}}>
            {avatar[ind] !== undefined && <img style={{height:'40px', width:'40px', margin: 'auto'}} src={avatar[ind]} alt="Preview" />}
            <h6 style={{color: '#ffffff', marginTop: '5px'}}>{p.userPseudo}</h6>
            </div>
            <h6 style={{backgroundColor: '#ffffff', width: `20px`, marginTop: '0.5vh', height:'20px', borderRadius: '20px', textAlign: "center", color: '#1d334a'}} >{p.step}</h6>
            </div>
            <h6 style={{textAlign: 'center', color: '#ffffff'}}>{`rôle : ${p.userRole}`}</h6>
        </div>
        </>
    ))
    }
    </div>

</div>





  const toggleDrawer = (anchor, open, val) => (event) => {
      val === 0 ? changeToChat() : changeToParticipants();
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  


  return (
    <div>
        <React.Fragment key={'right'}>
          <Button onClick={toggleDrawer('right', true, 0)} style={{right: '70px', position: 'absolute', marginTop: '20px', height: '40px', width: '40px'}}>
              {notif ? <Badge badgeContent={""} color="secondary">
            <ChatIcon style={{color: '#1d334a', height: '40px', width: '40px'}}/>
          </Badge> 
          :
          <ChatIcon style={{color: '#1d334a', height: '40px', width: '40px'}}/>
          }
          </Button>
          <Button onClick={toggleDrawer('right', true, 1)} style={{right: '200px', position: 'absolute', marginTop: '18px', height: '40px', width: '300px'}}>
          <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "#1d334a"}}>
            Afficher les participants
        </Typography>
              {notif ? <Badge badgeContent={""} color="secondary">
            <PeopleAltIcon style={{color: '#1d334a', height: '40px', width: '40px'}}/>
          </Badge> 
          :
          <PeopleAltIcon style={{color: '#1d334a', height: '40px', width: '40px'}}/>
          }
          </Button>
          <Drawer anchor={'right'} open={state['right']} onClose={toggleDrawer('right', false, 0)}>
          <div className="chat">
            {displayTab}
        </div>
          </Drawer>
        </React.Fragment>
    </div>
  );
}