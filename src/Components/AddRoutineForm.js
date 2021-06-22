import React, { useState } from 'react';
import { Button, Form, FormGroup, FormControl, Overlay, Tooltip } from "react-bootstrap";
import DatePicker from "react-datepicker";
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import { database, firebase } from '../Firebase/firebase';

import { isToday } from '../GlobalMethods';

import 'rc-time-picker/assets/index.css';
import '../Styling/AddRoutineForm.scss';

function AddRoutineForm(props) {

    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState(moment().hour(0).minute(0));
    const [startDateTime, setStartDateTime] = useState("");
    const [showInfoTooltip, setShowInfoTooltip] = useState(false);
    const target = React.useRef(null);

    const user = firebase.auth().currentUser;

    const durationFormat = "HH:mm";

    function validateForm() {
        // console.log(duration);
        return title.length > 0 && (duration && duration.format(durationFormat) !== '00:00') && startDateTime;
    }

    function handleSubmit(event) {
        event.preventDefault();

        var routineObj = {
            timestamp: new Date(),
            title: title,
            hours: duration.format(durationFormat).toString().split(":")[0],
            minutes: duration.format(durationFormat).toString().split(":")[1],
            startDateTime
        }
        //push task data to firebase
        database.collection("users").doc(user.uid).update({
            routines: firebase.firestore.FieldValue.arrayUnion(routineObj)
        });

        //reset state values
        setTitle("");
        setStartDateTime("");
        setDuration(moment().hour(0).minute(0));
    }


    return (
        <div>

            <div className="AddRoutineForm-Content-Container">
                <div className="AddRoutineForm-Header">
                    <p className="AddRoutineForm-title">What are your routines?</p>
                    <img ref={target} onMouseLeave={() => setShowInfoTooltip(false)} onMouseEnter={() => setShowInfoTooltip(true)} className="Sail-info-icon" src="Assets/Images/info_icon.png" alt="info icon" />
                </div>

                <Overlay target={target.current} show={showInfoTooltip} placement="top">
                    {(props) => (
                        <Tooltip className="Sail-info-tooltip" {...props}>
                            You can add here anything you're required to do based on your schedule like work or school
                        </Tooltip>
                    )}
                </Overlay>
                <Form onSubmit={handleSubmit}>
                    <FormGroup controlId="routine-title">
                        <FormControl className="AddRoutineForm-textfield" type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                    </FormGroup>
                    {/* <FormGroup controlId="routine-timedate">
                        <FormControl className="AddRoutineForm-textfield" type="text" placeholder="Starting Time & Date" value="" onChange={e => () => { }} />
                    </FormGroup> */}

                    <DatePicker
                        selected={startDateTime}
                        onChange={date => setStartDateTime(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeCaption="Time"
                        dateFormat={startDateTime ? (isToday(startDateTime) ? "'Today at' h:mm aa" : "MMMM d 'at' h:mm aa") : null}
                        popperPlacement="top-end"
                        className="AddRoutineForm-DatePicker-textfield"
                        placeholderText="Select starting time & date"
                    />
                    <p className="AddRoutineForm-duration-label">Duration</p>

                    <TimePicker value={duration} onChange={value => setDuration(value)} className="AddRoutineForm-duration-textfield" popupClassName="TimePicker-duration-textfield-popup" clearIcon={<span></span>} placement="topLeft" showSecond={false} minuteStep={30} />

                    <Button className="AddRoutineForm-AddRoutineBtn" block disabled={!validateForm()} type="submit">
                        Add New Task +
                        </Button>
                </Form>
            </div>
        </div>
    );
}

export default AddRoutineForm;