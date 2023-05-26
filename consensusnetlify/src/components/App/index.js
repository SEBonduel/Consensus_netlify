import React, {Fragment, useContext, useState, useEffect} from 'react';
import '../../App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import HomeFr from '../HomeFr';
import HomeEn from '../HomeEn';
import HomeEsp from '../HomeEsp';
import HelpConnected from '../HelpConnected';
import HelpConnectedEn from '../HelpConnectedEn';
import HelpConnectedEsp from '../HelpConnectedEsp';
import HelpNotConnected from '../HelpNotConnected';
import HelpNotConnectedEn from '../HelpNotConnectedEn';
import HelpNotConnectedEsp from '../HelpNotConnectedEsp';
import AboutNotConnected from '../AboutNotConnected';
import AboutNotConnectedEn from '../AboutNotConnectedEn';
import AboutNotConnectedEsp from '../AboutNotConnectedEsp';
import AboutConnected from '../AboutConnected';
import AboutConnectedEn from '../AboutConnectedEn';
import AboutConnectedEsp from '../AboutConnectedEsp';
import Landing from '../Landing';
import LandingEn from '../LandingEn';
import LandingEsp from '../LandingEsp';
import Signup from '../Signup';
import SignupEn from '../SignupEn';
import SignupEsp from '../SignupEsp';
import Login from '../Login';
import LoginEn from '../LoginEn';
import LoginEsp from '../LoginEsp';
import ForgetPassword from '../ForgetPassword';
import ForgetPasswordEn from '../ForgetPasswordEn';
import ForgetPasswordEsp from '../ForgetPasswordEsp';
import NewPwdFr from '../NewPwdFr';
import NewPwdEn from '../NewPwdEn';
import NewPwdEsp from '../NewPwdEsp';
import Profile from '../Profile';
import ProfileEn from '../ProfileEn';
import ProfileEsp from '../ProfileEsp';
import History from '../History';
import HistoryEn from '../HistoryEn';
import HistoryEsp from '../HistoryEsp';
import Creation from '../Creation';
import Recap from '../Recap';
import {FirebaseContext} from '../Firebase';
import { SessionProvider } from '../SessionContext';
import IndividualDecision from '../IndividualDecision';
import Negociation from '../Negociation';
import Consensus from '../Consensus';
import Selection from '../Selection';
import { HelpProvider } from '../HelpContext';


const App = () => {

    // checks if a user is connected :
    /**************************** */
    const firebase = useContext(FirebaseContext);

    const [setUserSession] = useState(null);

    useEffect(() => {
        let listener = firebase.auth.onAuthStateChanged(user => {
            setUserSession(user);
        })
        return () => {
            listener()
        };
    }, [])
    /**************************** */

      // Sauvegarde et récupération des données de session
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    // Récupération des données de session au démarrage de l'application
    const data = JSON.parse(localStorage.getItem('sessionData'));
    if (data) {
      setSessionData(data);
    }
  }, []);

  useEffect(() => {
    // Sauvegarde des données de session à chaque mise à jour
    localStorage.setItem('sessionData', JSON.stringify(sessionData));
  }, [sessionData]);

    return (
        <Router>
            <Switch>
                <Fragment>
                    <HelpProvider>
                    <SessionProvider>
                        <Route exact path="/" component={HomeFr}/>
                        <Route exact path="/en" component={HomeEn}/>
                        <Route exact path="/esp" component={HomeEsp}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/loginEn" component={LoginEn}/>
                        <Route path="/loginEsp" component={LoginEsp}/>
                        <Route path="/signup" component={Signup}/>
                        <Route path="/signupEn" component={SignupEn}/>
                        <Route path="/signupEsp" component={SignupEsp}/>
                        <Route path="/landing" component={Landing}/>
                        <Route path="/landingEn" component={LandingEn}/>
                        <Route path="/landingEsp" component={LandingEsp}/>
                        <Route path="/forgetpassword" component={ForgetPassword}/>
                        <Route path="/forgetpasswordEn" component={ForgetPasswordEn}/>
                        <Route path="/forgetpasswordEsp" component={ForgetPasswordEsp}/>
                        <Route path="/newPwdFr" component={NewPwdFr}/>
                        <Route path="/newPwdEn" component={NewPwdEn}/>
                        <Route path="/newPwdEsp" component={NewPwdEsp}/>
                        <Route path="/profile" component={Profile}/>
                        <Route path="/profileEn" component={ProfileEn}/>
                        <Route path="/profileEsp" component={ProfileEsp}/>
                        <Route path="/history" component={History}/>
                        <Route path="/historyEn" component={HistoryEn}/>
                        <Route path="/historyEsp" component={HistoryEsp}/>
                        <Route path="/creation" component={Creation}/>
                        <Route path="/recap" component={Recap}/>   
                        <Route path="/individualDecision" component={IndividualDecision}/> 
                        <Route path="/negociation" component={Negociation}/> 
                        <Route path="/consensus" component={Consensus}/> 
                        <Route path="/selection" component={Selection}/>
                        <Route path="/aboutNotConnected" component={AboutNotConnected}/>
                        <Route path="/aboutNotConnectedEn" component={AboutNotConnectedEn}/>
                        <Route path="/aboutNotConnectedEsp" component={AboutNotConnectedEsp}/>
                        <Route path="/aboutConnected" component={AboutConnected}/>
                        <Route path="/aboutConnectedEn" component={AboutConnectedEn}/>
                        <Route path="/aboutConnectedEsp" component={AboutConnectedEsp}/>
                        <Route path="/helpConnected" component={HelpConnected}/>
                        <Route path="/helpConnectedEn" component={HelpConnectedEn}/>
                        <Route path="/helpConnectedEsp" component={HelpConnectedEsp}/>
                        <Route path="/helpNotConnected" component={HelpNotConnected}/>
                        <Route path="/helpNotConnectedEn" component={HelpNotConnectedEn}/>
                        <Route path="/helpNotConnectedEsp" component={HelpNotConnectedEsp}/>
                    </SessionProvider>
                    </HelpProvider>
                </Fragment>
            </Switch>
        </Router>
    )
}

export default App; 
