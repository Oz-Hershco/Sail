import React from 'react'
import { Modal, Button, Tabs, Tab, Row, Col, Form, Overlay, Tooltip } from 'react-bootstrap';
import { firebase, database } from '../Firebase/firebase';
// import '../Actions/google-calendar-auth';

import { handleAuthClick, handleSignoutClick } from '../Actions/GoogleCalendarAuth';

import '../Styling/CalendarSyncSettings.scss';

function WeeklyScheduleSettings(props) {

    let weeklyschedulesettings = props.weeklyschedulesettings;

    const [showGetEventsTooltip, setShowGetEventsTooltip] = React.useState(false);
    const [showUpdateEventsTooltip, setShowUpdateEventsTooltip] = React.useState(false);
    const [showAutoScheduleInfoTooltip, setShowAutoScheduleInfoTooltip] = React.useState(false);
    const [showAutoScheduleDisabledTooltip, setShowAutoScheduleDisabledTooltip] = React.useState(false);

    const getEventsTarget = React.useRef(null);
    const updateEventsTarget = React.useRef(null);
    const autoScheduleInfoTarget = React.useRef(null);
    const autoScheduleDisabledTarget = React.useRef(null);

    const googleCalendarObj = props.googlecalendarobj ? props.googlecalendarobj : {};
    const user = firebase.auth().currentUser;
    const userId = user.uid;

    function toggleGetEventsOption(value) {

        weeklyschedulesettings.getEventsOption.isActive = value;

        database.collection("users").doc(userId).update({
            weeklyScheduleSettings: weeklyschedulesettings
        })
            .then(function () {
                // console.log("Document successfully updated!");
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }

    function toggleUpdateEventsOption(value) {

        weeklyschedulesettings.updateEventsOption.isActive = value;

        database.collection("users").doc(userId).update({
            weeklyScheduleSettings: weeklyschedulesettings
        })
            .then(function () {
                // console.log("Document successfully updated!");
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }

    function toggleAutoScheduleOption(value) {

        weeklyschedulesettings.autoSchedule = value;

        database.collection("users").doc(userId).update({
            weeklyScheduleSettings: weeklyschedulesettings
        })
            .then(function () {
                // console.log("Document successfully updated!");
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }

    function updateCalendarsGetList(value, isChecked) {

        if (isChecked) {
            if (!weeklyschedulesettings.getEventsOption.selectedCalendars.includes(value)) {
                weeklyschedulesettings.getEventsOption.selectedCalendars.push(value);
            }
        } else {
            var indexOfValue = weeklyschedulesettings.getEventsOption.selectedCalendars.indexOf(value);
            weeklyschedulesettings.getEventsOption.selectedCalendars.splice(indexOfValue, 1);
        }

        database.collection("users").doc(userId).update({
            weeklyScheduleSettings: weeklyschedulesettings
        })
            .then(function () {
                // console.log("Document successfully updated!");
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });

    }

    function updateCalendarToUpdate(value) {

        weeklyschedulesettings.updateEventsOption.selectedCalendar = value;

        database.collection("users").doc(userId).update({
            weeklyScheduleSettings: weeklyschedulesettings
        })
            .then(function () {
                // console.log("Document successfully updated!");
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });

    }

    function removeGoogleCalendar() {
        handleSignoutClick();
        return database.collection("users").doc(userId).update({
            weeklyScheduleSettings: firebase.firestore.FieldValue.delete()
        })
            .then(function () {
                // console.log("Document weeklyScheduleSettings successfully emptied!");
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }

    return (
        <Modal
            {...props}
            dialogClassName="CalendarSyncSettings-modal"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className="CalendarSyncSettings-body">
                <div className="CalendarSyncSettings-header">
                    <p className="CalendarSyncSettings-title">Weekly Schedule Settings</p>
                    <img className="CalendarSyncSettings-xButton" alt="modal x button" src="/Assets/Images/xIcon.png" onClick={() => { props.onHide() }} />
                </div>

                <Tabs defaultActiveKey="accounts" transition={false} id="CalendarSyncSettingsTabMenu" className="CalendarSyncSettingsTabMenu">
                    <Tab eventKey="accounts" title="Accounts">

                        {
                            googleCalendarObj && googleCalendarObj.isSignedIn ?
                                <div className="CalendarSyncSettings-Authorized-Accounts-Container">

                                    <div className="CalendarSyncSettings-Google-Authorized-Settings-Container">
                                        <img className="CalendarSyncSettings-Google-Authorized-Icon" src="Assets/Images/google icon.png" alt="google logo icon" /> <p className="CalendarSyncSettings-Google-Authorized-Text">Google Account</p>

                                        <div className="CalendarSyncSettings-Google-Authorized-Settings-Actions-Wrapper">
                                            <Row>
                                                <Col xl={8}>
                                                    <p className="CalendarSyncSettings-Google-Account-Name">{googleCalendarObj.authObj.currentUser.je.Pt.yu}</p>
                                                </Col>
                                                <Col xl={4}>
                                                    <p onClick={() => { removeGoogleCalendar() }} className="CalendarSyncSettings-Google-Account-Remove-Btn">Remove</p>
                                                </Col>
                                            </Row>
                                        </div>

                                    </div>

                                </div>
                                :
                                <div>
                                    <p className="CalendarSyncSettings-Authorization-Info-Text" >
                                        Authorize your account with google to connect your calendar with
                                        <span className="CalendarSyncSettings-Authorization-Info-Sail-Text" >
                                            <img className="CalendarSyncSettings-Authorization-Info-Icon" src="Assets/Images/animatedlogo.gif" alt="app logo gif" /> Sail</span>
                                    </p>
                                    <Button onClick={() => { handleAuthClick() }} className="CalendarSyncSettings-Google-Authorize-Btn">
                                        <img className="CalendarSyncSettings-Google-Authorize-Btn-Icon" src="Assets/Images/google icon.png" alt="google logo icon" /> <p className="CalendarSyncSettings-Google-Authorize-Text">Authorize Google Account</p>
                                    </Button>
                                </div>
                        }
                    </Tab>

                    <Tab eventKey="calendarsync" title="Calendar Sync" disabled={googleCalendarObj && googleCalendarObj.isSignedIn ? false : true}>

                        <div className="CalendarSyncSettings-Sync-Options-Wrapper">

                            <Overlay target={getEventsTarget.current} show={showGetEventsTooltip} placement="right">
                                {(props) => (
                                    <Tooltip className="Sail-info-tooltip" {...props}>
                                        Any event that is added to Sail will be added to your schedule as a new routine!
                                    </Tooltip>
                                )}
                            </Overlay>
                            <Overlay target={updateEventsTarget.current} show={showUpdateEventsTooltip} placement="right">
                                {(props) => (
                                    <Tooltip className="Sail-info-tooltip" {...props}>
                                        Any task or routine you create within Sail will be automatically updated in your calendar!
                                    </Tooltip>
                                )}
                            </Overlay>
                            <Overlay target={autoScheduleInfoTarget.current} show={showAutoScheduleInfoTooltip} placement="right">
                                {(props) => (
                                    <Tooltip className="Sail-info-tooltip" {...props}>
                                        Sail will automatically schedule your tasks based on your availability on both the app and your calendar
                                    </Tooltip>
                                )}
                            </Overlay>
                            <Overlay target={autoScheduleDisabledTarget.current} show={showAutoScheduleDisabledTooltip} placement="right">
                                {(props) => (
                                    <Tooltip className="Sail-info-tooltip" {...props}>
                                        To enable this feature please update the settings above to allow getting and updating your calendar events from within Sail
                                    </Tooltip>
                                )}
                            </Overlay>

                            <Form>
                                <div className="CalendarSyncSettings-Sync-Option-Container">
                                    <Row>
                                        <Col xl={10}>
                                            <p className="CalendarSyncSettings-Sync-Option-Text">Get events from my calendar</p>
                                            <img ref={getEventsTarget} onMouseLeave={() => setShowGetEventsTooltip(false)} onMouseEnter={() => setShowGetEventsTooltip(true)} className="Sail-info-icon" src="Assets/Images/info_icon.png" alt="info icon"></img>
                                        </Col>
                                        <Col xl={2}>
                                            <Form.Check
                                                type="switch"
                                                id="1"
                                                label=""
                                                className="CalendarSyncSettings-Sync-Option-Switch"
                                                onChange={(e) => { toggleGetEventsOption(e.currentTarget.checked) }}
                                                checked={weeklyschedulesettings.getEventsOption.isActive}
                                            />
                                        </Col>
                                    </Row>
                                    {weeklyschedulesettings.getEventsOption.isActive ?
                                        <div className="CalendarSyncSettings-Sync-Option-Config-Container">
                                            <p className={weeklyschedulesettings.getEventsOption.selectedCalendars.length ? "CalendarSyncSettings-Sync-Option-Config-Label" : "CalendarSyncSettings-Sync-Option-Config-Label error-text"} >Choose calendars to get events from</p>
                                            <div className="CalendarSyncSettings-Calendars-List-Container">
                                                {
                                                    googleCalendarObj.calendarList ?
                                                        googleCalendarObj.calendarList.map((calendar, i) => {
                                                            return (
                                                                <div key={i}>
                                                                    <Form.Check
                                                                        custom
                                                                        type="checkbox"
                                                                        id={`CalendarSyncSettings-Calendar-List-Item-Checkbox-${i}`}
                                                                        className="CalendarSyncSettings-Calendar-List-Item-Checkbox"
                                                                        label=""
                                                                        onChange={(e) => { updateCalendarsGetList(e.currentTarget.getAttribute("calendarid"), e.currentTarget.checked) }}
                                                                        calendarid={calendar.id}
                                                                        checked={weeklyschedulesettings.getEventsOption.selectedCalendars.includes(calendar.id)}
                                                                        disabled={calendar.primary}
                                                                    />
                                                                    <p className="CalendarSyncSettings-Calendar-List-Item-Text">{calendar.summary}</p>
                                                                    {
                                                                        calendar.primary ? <p className="CalendarSyncSettings-Primary-Calendar-Tag">Primary</p> : null
                                                                    }
                                                                </div>
                                                            );
                                                        }) : null
                                                }
                                            </div>
                                        </div>
                                        : null}


                                </div>

                                <div className="CalendarSyncSettings-Sync-Option-Container">
                                    <Row>
                                        <Col xl={10}>
                                            <p className="CalendarSyncSettings-Sync-Option-Text">Update routines/tasks in my calendar</p>
                                            <img ref={updateEventsTarget} onMouseLeave={() => setShowUpdateEventsTooltip(false)} onMouseEnter={() => setShowUpdateEventsTooltip(true)} className="Sail-info-icon" src="Assets/Images/info_icon.png" alt="info icon"></img>
                                        </Col>
                                        <Col xl={2}>
                                            <Form.Check
                                                type="switch"
                                                id="2"
                                                label=""
                                                className="CalendarSyncSettings-Sync-Option-Switch"
                                                onChange={(e) => { toggleUpdateEventsOption(e.currentTarget.checked) }}
                                                checked={weeklyschedulesettings.updateEventsOption.isActive}
                                            />
                                        </Col>
                                    </Row>

                                    {weeklyschedulesettings.updateEventsOption.isActive ?
                                        <div className="CalendarSyncSettings-Sync-Option-Config-Container">
                                            <p className="CalendarSyncSettings-Sync-Option-Config-Label" >Choose calendar to update</p>
                                            <Form.Control
                                                disabled={googleCalendarObj.calendarList ? false : true}
                                                as="select"
                                                className="custom-select CalendarSyncSettings-Sync-Calendar-Select-Control"
                                                onChange={e => updateCalendarToUpdate(e.currentTarget.value)}
                                                value={weeklyschedulesettings.updateEventsOption.selectedCalendar}
                                            >
                                                {
                                                    googleCalendarObj.calendarList ?
                                                        googleCalendarObj.calendarList.map((calendar, i) => {
                                                            return (<option key={i}>
                                                                {calendar.summary}
                                                            </option>);
                                                        }) : <option>Calendar Access Unavailable</option>
                                                }
                                            </Form.Control>
                                        </div>
                                        : null}

                                </div>

                                <div className="CalendarSyncSettings-Sync-Option-Container">
                                    <Row>
                                        <Col xl={10}>
                                            <p className="CalendarSyncSettings-Sync-Option-Text">Auto Schedule Tasks</p>
                                            <img ref={autoScheduleInfoTarget} onMouseLeave={() => setShowAutoScheduleInfoTooltip(false)} onMouseEnter={() => setShowAutoScheduleInfoTooltip(true)} className="Sail-info-icon" src="Assets/Images/info_icon.png" alt="info icon"></img>
                                        </Col>
                                        <Col xl={2}>
                                            <div
                                                ref={weeklyschedulesettings.getEventsOption.isActive && weeklyschedulesettings.updateEventsOption.isActive ? null : autoScheduleDisabledTarget}
                                                onMouseLeave={weeklyschedulesettings.getEventsOption.isActive && weeklyschedulesettings.updateEventsOption.isActive ? null : () => setShowAutoScheduleDisabledTooltip(false)}
                                                onMouseEnter={weeklyschedulesettings.getEventsOption.isActive && weeklyschedulesettings.updateEventsOption.isActive ? null : () => setShowAutoScheduleDisabledTooltip(true)}
                                            >
                                                <Form.Check
                                                    type="switch"
                                                    id="3"
                                                    label=""
                                                    className="CalendarSyncSettings-Sync-Option-Switch"
                                                    onChange={(e) => { toggleAutoScheduleOption(e.currentTarget.checked) }}
                                                    defaultChecked={weeklyschedulesettings.autoSchedule}
                                                    disabled={!(weeklyschedulesettings.getEventsOption.isActive && weeklyschedulesettings.updateEventsOption.isActive)}
                                                />
                                            </div>

                                        </Col>
                                    </Row>
                                </div>

                            </Form>
                        </div>

                    </Tab>
                </Tabs>

            </Modal.Body>

        </Modal>
    )
}

export default WeeklyScheduleSettings
