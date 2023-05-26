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

const HomeEn = (props) => {

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
                        <NavLink className="home-link-nav" to="En">Home</NavLink>
                        <NavLink className="about-link-nav" to="aboutNotConnectedEn">About</NavLink>
                        <NavLink className="help-link-nav" to="helpNotConnectedEn">Help</NavLink>
                        <NavLink className="login-link-nav" to="loginEn">Login</NavLink>
                        </div>
                    </div>
                </nav>
            </header>
            
            <div className="home-container">
            <div className='subtitle-and-choose-lang'>
                    <h1 className='slogan'>Team decision-making support</h1>
                    <Dropdown/>
                </div>
                <div className="new-session-content">
                    <span className='newsession'>Participate in a new session</span>
                    <div className="home-content">
                        <span className='session-code-span'>Enter the session code</span>
                        <NavLink className='input-to-log' to="loginEn"><input className='session-code-input' type="text" placeholder="session code" disabled/></NavLink>
                        <div className='validate-form'><NavLink className="login-link-home" to="loginEn"><button className='session-code-button'>Validate</button></NavLink></div>
                        <div className='create-or-my-session-list'>
                        <NavLink className="login-link-home" to="loginEn"><button className='create-session-button'>Create new session</button></NavLink>
                        <NavLink className="login-link-home" to="loginEn"><button className='my-session-button'>My sessions</button></NavLink>
                        </div>
                    </div>
                </div>

                <h1 className='slogan'>What do ConsensUs ?</h1>
                <div className='what-make-consensus'>
                    <span className='consensus-details'>ConsensUs is an innovative application designed to help groups reach a common agreement on controversial or difficult topics. It allows for the creation of online discussion sessions, where participants can express their opinions, share ideas, and discuss various aspects of a given subject. The application offers a user-friendly and intuitive interface that enables users to participate in real-time debates, provide feedback on specific questions, and vote on proposed suggestions.</span>
                    <span className='consensus-details'>The ConsensUs application is designed to be easy to use and accessible to everyone. It offers a range of advanced features, such as the ability to create private sessions and track the progress of discussions in real-time.</span>
                    <span className='consensus-details'>In summary, ConsensUs is a user-friendly and innovative application that allows groups to discuss controversial topics and find common solutions. It offers a range of advanced features that make the discussion process easier and more efficient. Whether you are a business leader, a teacher, or simply a concerned citizen looking to contribute to the resolution of complex problems, ConsensUs can help you achieve your goals in collaborative decision-making.</span>
                </div>

                <h1 className='slogan'>Summary</h1>
                
                <div className='summary'>
                    <div className='create-summary'>    <h2 className='summary-title'>CREATE</h2>    <span className='summary-span'>Create a new session to help your team make a decision.</span></div>
                    <div className='participate-summary'>    <h2 className='summary-title'>PARTICIPATE</h2>    <span className='summary-span'>Participate in a session and encourage members of your team to participate.</span></div>
                    <div className='consult-summary'><h2 className='summary-title'>CONSULT</h2>    <span className='summary-span'>Go back to your past sessions to analyze the results.</span></div>
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
export default HomeEn;
