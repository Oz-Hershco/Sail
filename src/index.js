import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css';
import AppRoutes, { history } from './AppRoutes';
import { firebase } from './Firebase/firebase';
import { UpdateDBUserData } from './Actions/auth';


let hasRendered = false;
const renderApp = (user) => {
    if (!hasRendered) {
        ReactDOM.render(<AppRoutes user={user} />, document.getElementById('root'));
        hasRendered = true;
    }
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


firebase.auth().onAuthStateChanged((user) => {
    //console.log(user);
    if (user) {
        UpdateDBUserData(user.uid);
        renderApp();
        if (history.location.pathname === '/' || history.location.pathname === '/SignUp') {
            history.push('/Home');
        }
        // console.log("signed in");
        // console.log(user);
    } else {
        renderApp();
        history.push('/');
        // console.log("signed out");
    }
});