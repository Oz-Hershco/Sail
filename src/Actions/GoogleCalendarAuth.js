import React from 'react'
import googleCredentials from '../Integrations/google-calendar-credentials.json';
import { firebase, database } from '../Firebase/firebase';


class GoogleCalendarAuth extends React.Component {
  constructor(props) {
    super(props)

    this.initClient = this.initClient.bind(this);

  }

  componentDidMount = () => {

    var thisComponent = this;
    var userId = firebase.auth().currentUser.uid;
    document.body.addEventListener('load', thisComponent.initClient());

  }

  //authorizing for the first time
  initClient() {

    var discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    var scope = "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/tasks";
    var thisComponent = this;

    window.gapi.client.init({
      apiKey: googleCredentials.web.api_key,
      clientId: googleCredentials.web.client_id,
      discoveryDocs,
      scope
    }).then(function () {
      // Listen for sign-in state changes.
      window.gapi.auth2.getAuthInstance().isSignedIn.listen(() => { updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get(), thisComponent) });

      // Handle the initial sign-in state.
      updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get(), thisComponent);
    }, function (error) {
      console.log(error);
    });
  }

  render() {
    return (
      <div></div>
    )
  }
}


/**
*  Called when the signed in status changes, to update the UI
*  appropriately. After a sign-in, the API is called.
*/
function updateSigninStatus(isSignedIn, thisComponent) {
  if (isSignedIn) {
    getCalendarList(isSignedIn, thisComponent);

    var userId = firebase.auth().currentUser.uid;
    database.collection("users").doc(userId).update({
      gapi: {
        access_token: window.gapi.auth2.getAuthInstance().currentUser.je.tc.access_token
      }
    });
    //listAllEvents(isSignedIn, thisComponent);
  } else {
    thisComponent.props.updatecalendarobj({})
  }

}


function getCalendarList(isSignedIn, thisComponent) {

  window.gapi.client.calendar.calendarList.list().then(function (response) {

    var calendarList = response.result.items;

    var primaryCalendarId;
    var primaryCalendarName;

    for (var c = 0; c < calendarList.length; c++) {

      if (calendarList[c].primary) {
        primaryCalendarId = calendarList[c].id;
        primaryCalendarName = calendarList[c].summary;
      }

    }

    var googleCalendarObj = {
      authObj: window.gapi.auth2.getAuthInstance(),
      isSignedIn,
      calendarList,
    }

    thisComponent.props.setprimarycalendar(primaryCalendarId, primaryCalendarName)
    thisComponent.props.updatecalendarobj(googleCalendarObj)

  });

}
/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listAllEvents(isSignedIn, thisComponent) {

  window.gapi.client.calendar.calendarList.list().then(function (response) {

    var calendars = response.result.items;
    // console.log('Calendars:', calendars);

    listMultipleCalendarEvents(calendars, isSignedIn, thisComponent);

  });


}

function listSingleCalendarEvents(calendarId, timeMin, timeMax) {

  return window.gapi.client.calendar.events.list({

    'calendarId': calendarId,
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'timeMax': timeMax,
    'timeMin': timeMin,
    'orderBy': 'startTime'

  }).then(response => response.result.items);
}

async function listMultipleCalendarEvents(calendarList, timeMin, timeMax) {

  var eventsArr = [];

  for (var c = 0; c < calendarList.length; c++) {
    // const calendarId = calendarList[c].id;
    const calendarId = calendarList[c];
    var events = await listSingleCalendarEvents(calendarId, timeMin, timeMax);
    eventsArr.push(...events);
  }

  return Promise.resolve(eventsArr);
}


/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  window.gapi.auth2.getAuthInstance().signOut();
}

/**
 *  Sign in the user upon button click.
 */

function handleAuthClick(event) {
  window.gapi.auth2.getAuthInstance().signIn();
}


export { GoogleCalendarAuth, handleAuthClick, handleSignoutClick, updateSigninStatus, listMultipleCalendarEvents }

