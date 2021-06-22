import { firebase, database, googleAuthProvider } from '../Firebase/firebase';

export const startGoogleLogin = () => {
    return firebase.auth().signInWithPopup(googleAuthProvider).then((data) => {
        const user = data.user;
        // console.log("google sign in", user);
    });
}

export const startLogin = (email, password) => {

    return firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        switch (errorCode) {
            case "auth/user-not-found":
                //Display error to user that this account does not exist
                console.log("User does not exist");
                break;
            case "auth/wrong-password":
                //Display error to user that password is incorrect
                console.log("Incorrect Password");
                break;
            default:
                break;
        }
    });

}
export const startLogout = () => {
    return firebase.auth().signOut();
}

export const createUser = (email, password, name) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        console.log("created user successfully")
        var user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: name
        }).then(function () {
            // Update successful.
        }).catch(function (error) {
            // An error happened.
        });

    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        console.log(errorCode);
        switch (errorCode) {
            case "auth/email-already-in-use":
                //Display error to user that this account already exists
                console.log("Account already exists");
                break;
            case "auth/weak-password":
                //Display error to user that password is too weak
                console.log("Weak Password");
                break;
            default:
                break;
        }
    });
}

export const UpdateDBUserData = (userId) => {
    database.collection("users").doc(userId).set({
        uid: userId
    }, { merge: true })
        .then(function () {
            // console.log("New user successfully added to db!");
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });
}