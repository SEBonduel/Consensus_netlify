import React, {useState, useEffect, useContext} from 'react';
import { NavLink } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import { usePage } from '../PageContext';
import "../HomeFr/home.css";
import logo_ERPI from "../../images/logo/ERPI.png";
import logo_ENSGSI from "../../images/logo/ENSGSI.png";
import logo_UNIV_LORRAINE from "../../images/logo/univLorraineLarge.png";
import Dropdown from '../Dropdown/index.js';
import '../Dropdown/dropdown.css';


const HomeEsp = (props) => {

    const firebase = useContext(FirebaseContext);

    const [userSession, setUserSession] = useState(null);

    const [email,] = useState("");

    const [password] = useState("");

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

    return userSession !== null ? 
        (<div className="loading"><div className="d-flex align-items-center">
        <strong>Loading ...</strong>
        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
      </div></div>)
    : 
    (          
    <><header className="header">
        
                <nav className="navbar-global">
                    <div className="app-title">
                        <h1 className='consensus-title'>ConsensUs</h1><style>@import url('https://fonts.googleapis.com/css2?family=Palanquin+Dark:wght@400;500;700&display=swap');</style>
                        <div className="navbar-subtitle">
                        <NavLink className="home-link-nav" to="Esp">Inicio</NavLink>
                        <NavLink className="about-link-nav" to="aboutNotConnectedEsp">Acerca de</NavLink>
                        <NavLink className="help-link-nav" to="helpNotConnectedEsp">Ayuda</NavLink>
                        <NavLink className="login-link-nav" to="loginEsp">Conexión</NavLink>
                        </div>
                    </div>
                </nav>
            </header>
            
            <div className="home-container">
                <div className='subtitle-and-choose-lang'>
                    <h1 className='slogan'>Ayuda en la toma de decisiones en equipo</h1>
                    <Dropdown/>
                </div>

                <div className="new-session-content">
                    <span className='newsession'>Participar en una nueva sesión</span>
                    <div className="home-content">
                        <span className='session-code-span'>Introducir el código de la sesión</span>
                        <NavLink className='input-to-log' to="loginEsp"><input className='session-code-input' type="text" placeholder="El código de la sesión" disabled/></NavLink>
                        <div className='validate-form'><NavLink className="login-link-home" to="loginEsp"><button className='session-code-button'>Validar</button></NavLink></div>
                        <div className='create-or-my-session-list'>
                        <NavLink className="login-link-home" to="loginEsp"><button className='create-session-button'>Crear una sesión</button></NavLink>
                        <NavLink className="login-link-home" to="loginEsp"><button className='my-session-button'>Mis sesiones</button></NavLink>
                        </div>
                    </div>
                </div>

                <h1 className='slogan'>¿Qué está haciendo ConsensUs?</h1>

                <div className='what-make-consensus'>
                    <span className='consensus-details'>ConsensUs es una aplicación innovadora diseñada para ayudar a los grupos a encontrar un acuerdo común sobre temas controvertidos o difíciles. Permite crear sesiones de discusión en línea, donde los participantes pueden expresar sus opiniones, compartir ideas y discutir los diferentes aspectos de un tema dado. La aplicación ofrece una interfaz amigable e intuitiva que permite a los usuarios participar en debates en tiempo real, dar su opinión sobre preguntas específicas y votar por las propuestas presentadas.</span>
                    <span className='consensus-details'>
La aplicación ConsensUs está diseñada para ser fácil de usar y accesible para todos. Ofrece una variedad de características avanzadas, como la capacidad de crear sesiones privadas y seguir el progreso de las discusiones en tiempo real.</span>
                    <span className='consensus-details'>En resumen, ConsensUs es una aplicación amigable e innovadora que permite a los grupos discutir temas controvertidos y encontrar soluciones comunes. Ofrece una variedad de características avanzadas que hacen que el proceso de discusión sea más fácil y efectivo. Ya sea que seas un líder empresarial, un profesor o simplemente un ciudadano preocupado por contribuir a la resolución de problemas complejos, ConsensUs puede ayudarte a alcanzar tus objetivos en cuanto a la toma de decisiones colaborativas.</span>
                </div>

                <h1 className='slogan'>Resumen</h1>
                
                <div className='summary'>
                    <div className='create-summary'>    <h2 className='summary-title'>CREACIÓN</h2>    <span className='summary-span'>Cree una nueva sesión para ayudar a su equipo a tomar una decisión.
</span></div>
                    <div className='participate-summary'>    <h2 className='summary-title'>PARTICIPACIÓN</h2>    <span className='summary-span'>Participe en una sesión y haga que los miembros de su equipo participen.</span></div>
                    <div className='consult-summary'><h2 className='summary-title'>CONSULTA</h2>    <span className='summary-span'>Revise sus sesiones anteriores para analizar los resultados.</span></div>
                </div>
            
                <div className='logo-footer'>
                    <img className='logo-footer-erpi' src={logo_ERPI} alt="logo"/>
                    <img className='logo-footer-ensgsi' src={logo_ENSGSI} alt="logo"/>
                    <img className='logo-footer-univlorraine' src={logo_UNIV_LORRAINE} alt="logo"/>
                </div>
            </div>
            
            </>
)
}

export default HomeEsp;
