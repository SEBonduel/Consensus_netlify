import React, {useState, useEffect, useContext} from 'react';
import { NavLink } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import { usePage } from '../PageContext';
import '../Login/login.css';


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


const LoginEsp = (props) => {

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
            !user ? setUserSession(user) : props.history.push("/landingEsp");
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
            props.history.push('/landingEsp');
        })
        .catch(error => {
            setEmail("");
            setPassword("");
            setError(error);
        })
    }
    const errorMessage = error !== "" && <span className='error-message'>El correo electrónico o la contraseña son incorrectos</span>
    
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
                <span className="home-link-nav-login" >Inicio</span>
                <span className="about-link-nav-login" >Acerca de</span>
                <span className="help-link-nav-login" >Ayuda</span>
                <span className="login-link-nav-login" >Conexión</span>
                </div>
            </div>
        </nav>
    <div className='login-form-title'>
        <span className='connecting-title'>Conexión</span>
        <NavLink className="new-account-link" to="signupEsp"><span className='New-on-platform'>¿Aún no tienes una cuenta? <strong>Regístrese !</strong></span></NavLink>
    </div>
    {errorMessage}
    <form onSubmit={handleSubmit}>
        <div className="login-inputForm">
        <div>
        <input onChange={e => {setEmail(e.target.value)}} value={email} type="email" id="log-email" autoComplete="off" required placeholder="Correo electrónico"/>
        </div>
        <div>
        <input onChange={e => {setPassword(e.target.value)}} value={password} type="password" id="log-password" autoComplete="off" required placeholder="Contraseña"/>
        </div>
            <Button onClick={handleSubmit} variant="contained" disabled={!btn} style={{backgroundColor:"#2144BF", borderRadius: '5px'}}>
                <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "#ffffff"}}>
                    Conexión
                </Typography>
            </Button>
            <NavLink className="forget-pwd-link" to="/forgetpasswordEsp"><strong>¿Olvidaste tu contraseña?</strong></NavLink>
        </div>
    </form>
</div>
</div>
)
}
export default LoginEsp;
