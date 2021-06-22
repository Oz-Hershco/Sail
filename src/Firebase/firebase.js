// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/firestore";
import "firebase/database";
import "firebase/storage";
import "firebase/auth";

//example of firebase config object
const firebaseConfig = {
    apiKey: "apikey",
    authDomain: "authDomain",
    databaseURL: "databaseURL",
    projectId: "projectId",
    storageBucket: "storageBucket",
    messagingSenderId: "messagingSenderId",
    appId: "appId",
    measurementId: "measurementId"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const database = firebase.firestore();
const storage = firebase.storage();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export { firebase, googleAuthProvider, database, storage }