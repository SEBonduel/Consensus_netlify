import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { PageProvider } from './components/PageContext';
import { CurrentSessionProvider } from './components/CurrentSessionContext';

import Firebase, {FirebaseContext} from './components/Firebase';

import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { AuthProvider } from './components/contexts/AuthContext';
//import Firebase, {FirebaseContext} from './components/Firebase';

ReactDOM.render(
  // only one initialization of Firebase for all components :
  <FirebaseContext.Provider value={new Firebase()}>
      <PageProvider> 
      <CurrentSessionProvider> 
        <App className="appColor"/>
        </CurrentSessionProvider> 
      </PageProvider>
  </FirebaseContext.Provider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
