

import React from 'react';
import {Router, Switch, Route} from "react-router-dom";
import {createBrowserHistory } from 'history';

import SignUpPage from './Pages/SignUpPage';
import LoginPage from './Pages/LoginPage';
import TasksPage from './Pages/TasksPage';

export const history = createBrowserHistory ();

function AppRoutes() {
    return (
        <Router history={history}>
            <div>
                <Switch>
                    <Route path="/" component={LoginPage} exact={true}/>
                    <Route path="/SignUp" component={SignUpPage} />
                    <Route path="/Home" component={TasksPage}/>
                </Switch>
            </div>
        </Router>
    );
}

export default AppRoutes;
