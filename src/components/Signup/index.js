import React, {useState, useContext, useEffect} from 'react';
import {NavLink} from 'react-router-dom';
import {FirebaseContext} from '../Firebase';
import './signup.css';


// Material UI :
/************************************************************* */
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
/**************************************************************** */



const Signup = (props) => {
    const classes = useStyles();

    const firebase = useContext(FirebaseContext)

    const [userSession, setUserSession] = useState(null);

    const userData = {
        pseudo: "",
        email: "",
        password: "",
        confirmPassword: ""
    }

    const [userLoginData, setUserLoginData] = useState(userData);

    const [error, setError] = useState("");

    

    useEffect(() => {
        let listener = firebase.auth.onAuthStateChanged(user => {
            !user ? setUserSession(user) : props.history.push("/landing");
        });
        return () => {
            listener()
        };
    }, )

    const handleChange = event => {
        setUserLoginData({...userLoginData, [event.target.id]: event.target.value});
    }

    const handleSubmit = event => {
        event.preventDefault();
        firebase.signupUser(email, password)
        .then((user) => {
            firebase.saveUserSession(user.user.uid).set({pseudo: pseudo, userSessions: []});
            setUserLoginData({...userData});
            props.history.push("/landing");
        })
        .catch(error => {
            setError(error);
            setUserLoginData({...userData});
        })
    }

    

    // destructuring :
    const {pseudo, email, password, confirmPassword} = userLoginData;

    const btn = <Button onClick={handleSubmit} variant="contained" disabled={email === '' || password === '' || password !== confirmPassword } style={{backgroundColor:"#2144BF", borderRadius: '5px'}}>
        <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "#ffffff"}}>
            S'inscrire
        </Typography>
    </Button>

    const errorMessage = error !== "" && <span className='mail-format-bad'>L'Adresse email n'est pas au bon format ou le mot de passe est trop court</span>

    return userSession !== null ? 
        (<div className="loading"><div className="d-flex align-items-center">
        <strong>Loading ...</strong>
        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
      </div></div>)
    : 
(
        <div className="signup-content">
            
            <div className="header-signup">
        
        <nav className="navbar-signup">
            <div className="app-title-signup">
                <h1 className='consensus-title-signup'>ConsensUs</h1><style>@import url('https://fonts.googleapis.com/css2?family=Palanquin+Dark:wght@400;500;700&display=swap');</style>
                <div className="navbar-subtitle-signup">
                <span className="home-link-nav-signup" >Accueil</span>
                <span className="about-link-nav-signup" >A propos</span>
                <span className="help-link-nav-signup" >Aide</span>
                <span className="login-link-nav-signup" >Connexion</span>
                </div>
            </div>
        </nav>
    <div className='signup-form-title'>
        <span className='sign-title'>INSCRIVEZ - VOUS</span>
        <NavLink className="login-account-link" to="login"><span className='already-on-platform'>Vous avez déjà un compte ? <strong>Connectez-vous !</strong></span></NavLink>
    </div>
    {errorMessage}
            <form onSubmit={handleSubmit}>
            <div className="signup-input-form">
                <div>
                <input onChange={handleChange} value={pseudo} type="text" id="pseudo" autoComplete="off" placeholder="Pseudo"/>
                </div>

                <div>
                <input onChange={handleChange} value={email} type="email" id="email" autoComplete="off" required placeholder="Adresse email"/>
                </div>

                <div>
                <input onChange={handleChange} value={password} type="password" id="password" autoComplete="off" required placeholder="Mot de passe"/>
                </div>

                <div>
                <input onChange={handleChange} value={confirmPassword} type="password" id="confirmPassword" autoComplete="off" required placeholder="Confirmez votre mot de passe"/>
                </div>                
                {btn}
                <NavLink className="sign-help-link" to="/helpNotConnected"><strong>Besoin d'aide pour l'inscription  ?</strong></NavLink>
                </div>

            </form>
            </div>
        </div>
    );
};

            

export default Signup;
