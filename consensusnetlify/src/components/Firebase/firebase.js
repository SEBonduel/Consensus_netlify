import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyD7ckOK_rraDxxqWfZqhk7-upfk0Sd9wxM",
  authDomain: "consensus-d059a.firebaseapp.com",
  projectId: "consensus-d059a",
  storageBucket: "consensus-d059a.appspot.com",
  messagingSenderId: "393514520074",
  appId: "1:393514520074:web:715f4192a629baa84e59f3"
  };


class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
    this.db = app.firestore();
  }

  // sign up
  signupUser = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);

  // log in
  loginUser = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

  // log out
  signoutUser = () => this.auth.signOut();

  // recover password
  passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

  // 
  saveSession = (sid) => this.db.doc(`sessions/${sid}`);

  //
  saveUserSession = (uid) => this.db.doc(`users/${uid}`);

  //
  saveMessage = (uid) => this.db.doc(`messages/${uid}`);

  //
  saveParticipants = (sid, uid) => this.db.doc(`sessions/${sid}/participants/${uid}`);

  //
  saveMessages = (sid, mid) => this.db.doc(`sessions/${sid}/messages/${mid}`);

  //
  saveGroup = (sid, gid) => this.db.doc(`sessions/${sid}/groups/${gid}`);

  //
  saveGroupMessages = (sid, gid, mid) => this.db.doc(`sessions/${sid}/groups/${gid}/messages/${mid}`);
  
}





export default Firebase;