import React, {useContext, useState, useEffect} from 'react';
import {FirebaseContext} from '../Firebase';
import { usePage } from '../PageContext';
import Avatar from 'react-avatar-edit';
import { useCurrentSession } from '../CurrentSessionContext';
import { useHelp } from '../HelpContext';
import explication from '../../images/profilHelp.png';
import { NavLink } from 'react-router-dom';
import undefinedPic from '../../images/undefined.png';
import Logout from '../Logout';
import "./profile.css";
import DropdownProfile from '../DropdownProfile';


// Material UI :
/******************************************************** */
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';


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
/********************************************************* */

const Profile = (props) => {

    const classes = useStyles();

    const [displayChoose, setDisplayChoose] = useState(false);

    const firebase = useContext(FirebaseContext);

    const { setCurrentHelp } = useHelp();

    const { setIdCurrentSession } = useCurrentSession();

    const { setCurrentPage } = usePage();

    const [userSession, setUserSession] = useState(null);

    // default values :
    const data = {
        pseudo: "",
        email: "",
        status: "",
        avatar : ""
    }

    const [userData, setUserData] = useState(data);

    const handleChange = (event) => {
        setUserData({...userData, [event.target.id]: event.target.value});
    };

    useEffect(() => {
      setIdCurrentSession(false);
      setCurrentPage("global2");
      setCurrentHelp(explication);
        let listener = firebase.auth.onAuthStateChanged(user => {
            user ? setUserSession(user) : props.history.push("/");
        })
        return () => {
            listener()
        };
    }, [])


    const [pseudo, setPseudo] = useState("");

    useEffect(() => {
      const userSessionRef = (userSession !== null) && firebase.db.collection("users").doc(userSession.uid);
      userSessionRef &&
      userSessionRef.get().then((doc) => {
          if (!doc.exists) return;
          setPseudo(doc.data().pseudo);
      })
  }, [userSession],[])


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


  function onClose() {
    setPreview(null);
  }

  function onCrop(preview) {
    setPreview(preview);
    
  }



  const [newUsername, setNewUsername] = useState('');

  const handleUsernameChange = (event) => {
    setNewUsername(event.target.value);
  };

  const isDisabled = () => {
    return newUsername.trim().length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (newUsername.trim().length === 0) {
      // Le nouveau pseudo est vide, afficher un message d'erreur ou prendre une autre action
      console.log('Le nouveau pseudo ne peut pas être vide');
     
      return;
    }
    // Mettre à jour le pseudo de l'utilisateur dans Firebase
    firebase.auth.currentUser.updateProfile({
      displayName: newUsername
    })
    firebase.db.collection("users").doc(userSession.uid).update({ pseudo: newUsername })
    .then(() => {
        console.log('Pseudo mis à jour avec succès dans la collection "users" !');
        setPseudo(newUsername); // Mettre à jour l'affichage du pseudo dans votre composant
    })
    .catch((error) => {
        console.error('Erreur lors de la mise à jour du pseudo dans la collection "users" :', error);
    });
  };



  useEffect(() => {
    if (userSession) {
      const userSessionRef = firebase.db.collection("users").doc(userSession.uid);
      userSessionRef.get().then((doc) => {
        if (doc.exists) {
          setPseudo(doc.data().pseudo);
        }
      });
    }
  }, [userSession]);


  function onClick(e) {
    firebase.saveUserSession(userSession.uid).set({avatar: preview}, {merge:true});
    e.preventDefault();
    setDisplayChoose(false);
  }

  const displayChooseFile = () => {
    setDisplayChoose(true);
  }

  const displayAvatar = 
   <div className="avatar">
  <Avatar
  width={150}
  height={150}
  onCrop={onCrop}
  onClose={onClose}

  />
</div>  
  console.log(pseudo);



    return userSession === null ? 
    
    (<div className="loading"><div className="d-flex align-items-center">
    <strong>Loading ...</strong>
    <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
  </div></div>)
    :  
    <><header className="header">

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
        <div className="profile-content">
          <div className="head">
            <div className="slogan-and-dropdown">
            <h1 className="slogan">Bienvenue sur votre compte {pseudo}</h1>
            <DropdownProfile/>
                </div>
            <div className="confidential-content-and-avatar">

              <div className="confidential-content">
                <span className='confidential-content-title'><strong>Données confidentielles</strong></span>
                <div className='confidential-content-email'>
                  <TextField disabled="true" onChange={handleChange} value={userSession.email} id="email2" type="email" label="Adresse email" variant="filled" style={{backgroundColor: "#fdf4e3", borderRadius: '5px'}}/>
                </div>
                <div className='confidential-content-pwd'>
                  <NavLink to="NewPwdFr"><button className='change-pwd'>Modifier votre mot de passe</button></NavLink>
                </div>
              </div>

              <div className="avatar">
                
                  {(displayChoose || preview === undefined) ? displayAvatar : <img style={{height:'150px', width:'150px', margin: 'auto'}} src={preview} alt="Preview" />}
                  {(displayChoose) ?
                      <Button onClick={onClick} variant="contained" style={{backgroundColor:"#2144BF", margin: 'auto', marginTop: '15px'}}>
                        <DoneIcon/>
                        <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "white"}}>
                            Valider mon avatar
                        
                        </Typography>
                      </Button>
                         :
                      <Button onClick={displayChooseFile} variant="contained" style={{backgroundColor:"#2144BF", margin: 'auto', marginTop: '15px'}}>
                          <EditIcon />
                          <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "white"}}>
                              Modifier mon avatar
                          </Typography>
                      </Button>}
              </div>
                  
              <div className="personnal-content">
                <span className='personnal-content-title'><strong>Données personnelles</strong></span>
                  <span className='personnal-content-email-title'>Nouveau pseudo :</span>
                  <div className="personnal-content-email">
      <form onSubmit={handleSubmit}>
        <input className='new-username' type="text" value={newUsername} onChange={handleUsernameChange} />
        <button className='change-pseudo' disabled={isDisabled()} type="submit">Modifier</button>
      </form>
    </div>
                
              </div>
            </div>
          </div>
        </div>
  
          
            
          
          
        </>
}

export default Profile;
