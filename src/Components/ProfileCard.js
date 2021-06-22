import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { firebase, database } from '../Firebase/firebase';

import { handleSignoutClick } from '../Actions/GoogleCalendarAuth';
import { startLogout } from '../Actions/auth';

import '../Styling/ProfileCard.scss';



function ProfileCard(props) {

    function logoutUser() {

        // var userId = firebase.auth().currentUser.uid;
        // database.collection("users").doc(userId).update({
        //     gapi: {
        //         isAuthorized: false
        //     }
        // });

        //sign out of gapi auth2
        //handleSignoutClick();
        //sign out of fb auth user
        startLogout();

    }

    return (
        <div>
            <div className="ProfileCard-container">
                <Row noGutters={true}>
                    <Col>
                        <img onClick={() => { logoutUser() }} className="ProfileCard-signout-btn" src="Assets/Images/signout_icon.png" alt="signout button" />
                    </Col>
                </Row>
                <Row noGutters={true}>
                    <Col>
                        <img className="ProfileCard-profile-pic" src={props.currentprofilepic} alt="profilepic" />
                        <p className="ProfileCard-displayName">{props.displayname}</p>
                        <p className="ProfileCard-email">{props.email}</p>
                        <button onClick={() => { props.setprofilesettingsmodal() }} type="button" className="ProfileCard-profileSettings-Btn btn btn-primary">Profile Settings</button>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default ProfileCard;