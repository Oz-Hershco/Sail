import React, { useState } from 'react';
import uuid from 'react-uuid'
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import { Button, Form, FormGroup, FormControl, Overlay, Tooltip } from "react-bootstrap";
import { database, firebase } from '../Firebase/firebase';

import { hasEmptySpaces } from '../GlobalMethods';
import TagsPicker from './TagsPicker';

import 'rc-time-picker/assets/index.css';
import '../Styling/AddTaskForm.scss';

import "react-datepicker/dist/react-datepicker.css";

function AddTaskForm(props) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [duration, setDuration] = useState(moment().hour(0).minute(0));
    const [showInfoTooltip, setShowInfoTooltip] = useState(false);
    const target = React.useRef(null);

    const user = firebase.auth().currentUser;

    const durationFormat = "HH:mm";

    function validateForm() {
        return title.length > 0 && description.length > 0 && (duration && duration.format(durationFormat) !== '00:00');
    }

    function handleSubmit(event) {
        event.preventDefault();

        var taskObj = {
            timestamp: new Date(),
            title: title,
            description: description,
            tags: tags ? tags : "",
            hours: duration.format(durationFormat).toString().split(":")[0],
            minutes: duration.format(durationFormat).toString().split(":")[1],
            inProgress: false,
            completed: false,
            id: uuid(),
        }



        var tagsArr = props.tags;
        tagsArr.includes(tags) || hasEmptySpaces(tags) || !tags.length ? tagsArr = props.tags : tagsArr.push(tags);
        //push task data to firebase
        database.collection("users").doc(user.uid).update({
            tasks: firebase.firestore.FieldValue.arrayUnion(taskObj),
            tags: tagsArr
        });

        //reset state values
        setTitle("");
        setDescription("");
        setTags("");
        setDuration(moment().hour(0).minute(0));
    }

    function getTagsPickerValue(tagValue) {
        setTags(tagValue);
        // console.log(tagValue);
    }

    return (
        <div>
            <div className="AddTaskForm-Content-Container">
                <div className="AddTaskForm-Header">
                    <p className="AddTaskForm-title">What do you need to do?</p>
                    <img ref={target} onMouseLeave={() => setShowInfoTooltip(false)} onMouseEnter={() => setShowInfoTooltip(true)} className="Sail-info-icon" src="Assets/Images/info_icon.png" alt="info icon" />
                </div>
                <Overlay target={target.current} show={showInfoTooltip} placement="top">
                    {(props) => (
                        <Tooltip className="Sail-info-tooltip" {...props}>
                            You can add anything you want to complete during your week based on your schedule
                        </Tooltip>
                    )}
                </Overlay>
                <Form onSubmit={handleSubmit}>
                    <FormGroup controlId="title">
                        <FormControl className="AddTaskForm-textfield" type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                    </FormGroup>
                    <FormGroup controlId="description">
                        <FormControl maxLength="300" className="AddTaskForm-description-textfield" as="textarea" rows="3" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
                    </FormGroup>

                    <TagsPicker gettagspickervalue={getTagsPickerValue} tags={props.tags} />

                    <p className="AddTaskForm-duration-label">Duration</p>
                    {/* <TimeField className="AddTaskForm-duration-textfield" value={duration} onChange={e => setDuration(e.target.value)} /> */}
                    <TimePicker value={duration} onChange={value => setDuration(value)} className="AddTaskForm-duration-textfield" popupClassName="TimePicker-duration-textfield-popup" clearIcon={<span></span>} placement="topLeft" showSecond={false} minuteStep={30} />
                    <Button className="AddTaskForm-AddTaskBtn" block disabled={!validateForm()} type="submit">
                        Add New Task +
                        </Button>
                </Form>
            </div>
        </div>
    );
}

export default AddTaskForm;