import React, {useState, useEffect, useContext} from 'react';
import { NavLink } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import { usePage } from '../PageContext';
import logo_ERPI from "../../images/logo/ERPI.png";
import logo_ENSGSI from "../../images/logo/ENSGSI.png";
import logo_UNIV_LORRAINE from "../../images/logo/univLorraineLarge.png";
import Dropdown from '../Dropdown/index.js';
import '../Dropdown/dropdown.css';
import "./home.css";

const HomeFr = (props) => {

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
                        <NavLink className="home-link-nav" to="/">Accueil</NavLink>
                        <NavLink className="about-link-nav" to="aboutNotConnected">A propos</NavLink>
                        <NavLink className="help-link-nav" to="helpNotConnected">Aide</NavLink>
                        <NavLink className="login-link-nav" to="login">Connexion</NavLink>
                        </div>
                    </div>
                </nav>
            </header>
            
            <div className="home-container">
                <div className='subtitle-and-choose-lang'>
                    <h1 className='slogan'>Aide à la prise de décision en équipe</h1>
                    <Dropdown/>
                </div>

                <div className="new-session-content">
                    <span className='newsession'>Participer à une nouvelle session</span>
                    <div className="home-content">
                        <span className='session-code-span'>Entrer le code de la session</span>
                        <NavLink className='input-to-log' to="login"><input className='session-code-input' type="text" placeholder="Code de la session" disabled/></NavLink>
                        <div className='validate-form'><NavLink className="login-link-home" to="login"><button className='session-code-button'>Valider</button></NavLink></div>
                        <div className='create-or-my-session-list'>
                        <NavLink className="login-link-home" to="login"><button className='create-session-button'>Créer une session</button></NavLink>
                        <NavLink className="login-link-home" to="login"><button className='my-session-button'>Mes sessions</button></NavLink>
                        </div>
                    </div>
                </div>

                <h1 className='slogan'>Que fait ConsensUs ?</h1>

                <div className='what-make-consensus'>
                    <span className='consensus-details'>ConsensUs est une application innovante conçue pour aider les groupes à trouver un accord commun sur des sujets controversés ou difficiles. Elle permet de créer des sessions de discussion en ligne, où les participants peuvent exprimer leurs opinions, partager des idées et discuter des différents aspects d'un sujet donné. L'application offre une interface conviviale et intuitive qui permet aux utilisateurs de participer aux débats en temps réel, de donner leur avis sur des questions spécifiques et de voter pour les propositions proposées.</span>
                    <span className='consensus-details'>L'application ConsensUs est conçue pour être facile à utiliser et accessible à tous. Elle offre une gamme de fonctionnalités avancées, telles que la possibilité de créer des sessions privées et de suivre l'avancement des discussions en temps réel.</span>
                    <span className='consensus-details'>En résumé, ConsensUs est une application conviviale et innovante qui permet aux groupes de discuter des sujets controversés et de trouver des solutions communes. Elle offre une gamme de fonctionnalités avancées qui rendent le processus de discussion plus facile et plus efficace. Que vous soyez un leader d'entreprise, un professeur ou simplement un citoyen soucieux de contribuer à la résolution de problèmes complexes, ConsensUs peut vous aider à atteindre vos objectifs en matière de prise de décision collaborative.</span>
                </div>

                <h1 className='slogan'>En résumé</h1>
                
                <div className='summary'>
                    <div className='create-summary'>    <h2 className='summary-title'>CRÉATION</h2>    <span className='summary-span'>Créez une nouvelle session pour aider votre équipe à prendre une décision.</span></div>
                    <div className='participate-summary'>    <h2 className='summary-title'>PARTICIPATION</h2>    <span className='summary-span'>Participez à une session et faites participer les membres de votre équipe</span></div>
                    <div className='consult-summary'><h2 className='summary-title'>CONSULTATION</h2>    <span className='summary-span'>Revenez sur vos sessions passées pour analyser les résultats</span></div>
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
export default HomeFr;
