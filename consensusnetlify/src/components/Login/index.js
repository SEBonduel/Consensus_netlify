import React, {useState, useEffect, useContext} from 'react';
import { NavLink } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import { usePage } from '../PageContext';
import './login.css';


// Material UI :
/****************************************************** */
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
/******************************************************** */  


const Login = (props) => {

    const classes = useStyles();

    const firebase = useContext(FirebaseContext);

    const [userSession, setUserSession] = useState(null);

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const [btn, setBtn] = useState(false);

    const { setCurrentPage } = usePage();

    useEffect(() => {
        if (password.length > 5 && email !== ""){
            setBtn(true);
        } else if (btn) {
            setBtn(false);
        }
    }, [password, email, btn])

    useEffect(() => {
        setCurrentPage("global");
        let listener = firebase.auth.onAuthStateChanged(user => {
            !user ? setUserSession(user) : props.history.push("/landing");
        });
        return () => {
            listener()
        };
    }, )

    const handleSubmit = e => {
        e.preventDefault();
        firebase.loginUser(email, password)
        .then(user => {
            setEmail("");
            setPassword("");
            props.history.push('/landing');
        })
        .catch(error => {
            setEmail("");
            setPassword("");
            setError(error);
        })
    }

    const errorMessage = error !== "" && <span className='error-message'>L'email ou le mot de passe est incorrect</span>

    return userSession !== null ? 
        (<div className="loading"><div className="d-flex align-items-center">
        <strong>Loading ...</strong>
        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
      </div></div>)
    : 
    (<div className="login-content">          
    <div className="header-login">
        
        <nav className="navbar-login">
            <div className="app-title-login">
                <h1 className='consensus-title-login'>ConsensUs</h1><style>@import url('https://fonts.googleapis.com/css2?family=Palanquin+Dark:wght@400;500;700&display=swap');</style>
                <div className="navbar-subtitle-login">
                <span className="home-link-nav-login" >Accueil</span>
                <span className="about-link-nav-login" >A propos</span>
                <span className="help-link-nav-login" >Aide</span>
                <span className="login-link-nav-login" >Connexion</span>
                </div>
            </div>
        </nav>
    <div className='login-form-title'>
        <span className='connecting-title'>CONNECTEZ - VOUS</span>
        <NavLink className="new-account-link" to="signup"><span className='New-on-platform'>Vous n'avez pas encore de compte ? <strong>Inscrivez-vous !</strong></span></NavLink>
    </div>
    {errorMessage}
    <form onSubmit={handleSubmit}>
        <div className="login-inputForm">
        <div>
        <input onChange={e => {setEmail(e.target.value)}} value={email} type="email" id="log-email" autoComplete="off" required placeholder="Adresse email"/>
        </div>
        <div>
        <input onChange={e => {setPassword(e.target.value)}} value={password} type="password" id="log-password" autoComplete="off" required placeholder="Mot de passe"/>
        </div>
            <Button onClick={handleSubmit} variant="contained" disabled={!btn} style={{backgroundColor:"#2144BF", borderRadius: '5px'}}>
                <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "#ffffff"}}>
                    Connexion
                </Typography>
            </Button>
            <NavLink className="forget-pwd-link" to="/forgetpassword"><strong>Mot de passe oublié ?</strong></NavLink>
        </div>
    </form>
</div>
</div>
)
}
export default Login;
