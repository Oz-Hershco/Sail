import React from 'react';
import { Button, Col, Row, Dropdown } from 'react-bootstrap';
import { database, firebase } from '../Firebase/firebase';
import DatePicker from "react-datepicker";
import TimePicker from 'rc-time-picker';
import moment from 'moment';

import { isToday, NotifyOnStartedTask } from '../GlobalMethods';

import 'rc-time-picker/assets/index.css';
import '../Styling/ToDoCard.scss'

function ToDoCard(props) {


    const [taskDurationEditbox, setTaskDurationEditbox] = React.useState(false);

    const user = firebase.auth().currentUser;
    const durationFormat = "HH:mm";

    var isTaskComplete = props.completed;
    var isTaskInProgress = props.isTaskInProgress;
    var cardButtonClass = isTaskInProgress ? "ToDoCard-finishTaskBtn" : "ToDoCard-startTaskBtn";
    var taskId = props.taskid;
    var startDateTime = props.startDateTime ? props.startDateTime.toDate() : null;
    var tasks = props.tasks;

    function handleStartTask(e) {

        var currentTaskId = e.currentTarget.getAttribute("taskid");
        var currentTask;
        for (var s = 0; s < tasks.length; s++) {

            tasks[s].inProgress = false;

            if (currentTaskId === tasks[s].id) {
                var now = new Date();
                tasks[s].inProgress = true;
                tasks[s].startingTime = now;
                currentTask = tasks[s];
            }

        }

        return database.collection("users").doc(user.uid).update({
            tasks: tasks,
            anyTaskInProgress: true
        })
            .then(function () {
                // console.log("Document successfully updated!");
                NotifyOnStartedTask(currentTask, tasks, database, user);
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });

    }


    function handleFinishTask(e) {

        var currentTaskId = e.currentTarget.getAttribute("taskid");
        for (var s = 0; s < tasks.length; s++) {

            tasks[s].inProgress = false;

            if (currentTaskId === tasks[s].id) {
                tasks[s].completed = true;
            }

        }

        return database.collection("users").doc(user.uid).update({
            tasks: tasks,
            anyTaskInProgress: false
        })
            .then(function () {
                // console.log("Document successfully updated!");
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });

    }

    function handleTaskCompleteSatus(booleanOption) {

        for (var s = 0; s < tasks.length; s++) {

            if (taskId === tasks[s].id) {
                tasks[s].completed = booleanOption;
            }

        }

        return database.collection("users").doc(user.uid).update({
            tasks: tasks,
        })
            .then(function () {
                // console.log("Document successfully updated!");
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });

    }

    function handleDeleteTask(e) {

        var currentTaskId = e.currentTarget.getAttribute("taskid");
        var updatedTasksArray = tasks.filter((task) => task.id !== currentTaskId);

        return database.collection("users").doc(user.uid).update({
            tasks: updatedTasksArray,
        })
            .then(function () {
                // console.log("Document successfully updated!");
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }

    function setTaskDuration(value) {

        if (value) {
            var previousValue;

            for (var s = 0; s < tasks.length; s++) {

                if (taskId === tasks[s].id) {
                    previousValue = moment().hour(tasks[s].hours).minute(tasks[s].minutes);
                    if (previousValue.format(durationFormat).toString() !== value.format(durationFormat).toString() && value) {
                        tasks[s].hours = value.format(durationFormat).toString().split(":")[0];
                        tasks[s].minutes = value.format(durationFormat).toString().split(":")[1];
                    }
                }

            }

            // console.log(previousValue.format(durationFormat).toString() !== value.format(durationFormat).toString() ? true : false)
            //making sure the content is different before updating firebase
            return previousValue.format(durationFormat).toString() === value.format(durationFormat).toString() || (value.format(durationFormat) === "0:00") ? previousValue === value : database.collection("users").doc(user.uid).update({
                tasks,
            })
                .then(function () {
                    // console.log("Document successfully updated!");
                })
                .catch(function (error) {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
        }

    }

    const CalendarDateTimeSelectionInput = ({ value, onClick }) => (

        isTaskInProgress ? <p className="ToDoCard-dateandtime">{value}</p> :
            (
                value ? <p onClick={onClick} className="ToDoCard-dateandtime ToDoCard-dateandtime-active">{value}</p> :
                    <div className="ToDoCard-empty-dateandtime-container" onClick={onClick}>
                        <img className="ToDoCard-empty-dateandtime-icon" src="Assets/Images/calendar_icon.png" alt="select task time and date" />
                    </div>
            )
    );

    function setTaskDateandTime(date) {

        for (var s = 0; s < tasks.length; s++) {

            if (taskId === tasks[s].id) {
                tasks[s].startDateTime = new Date(date);
            }

        }

        return database.collection("users").doc(user.uid).update({
            tasks,
        })
            .then(function () {
                // console.log("Document successfully updated!");
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }

    function setTaskContent(e, value, prop) {

        var previousValue;

        for (var s = 0; s < tasks.length; s++) {

            if (taskId === tasks[s].id) {
                previousValue = tasks[s][prop];
                if (previousValue !== value && value) {
                    tasks[s][prop] = value;
                }
            }

        }

        //making sure the content is different before updating firebase
        return previousValue === value || !value ? e.currentTarget.textContent = previousValue : database.collection("users").doc(user.uid).update({
            tasks,
        })
            .then(function () {
                // console.log("Document successfully updated!");
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }

    return (
        <div className="ToDoCard-Container">
            <Row>
                <Col>
                    {
                        isTaskInProgress ? null :
                            <Dropdown>
                                <Dropdown.Toggle className="ToDoCard-options-btn" variant="success" id="dropdown-basic">
                                    <img src="Assets/Images/card_options_icon.png" alt="card options button" />
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="ToDoCard-options-menu" alignRight={true}>
                                    {
                                        isTaskComplete ? null : <Dropdown.Item onClick={() => { handleTaskCompleteSatus(true) }} className="ToDoCard-options-menu-btn" href="#">Complete Task</Dropdown.Item>
                                    }
                                    <Dropdown.Item onClick={handleDeleteTask} taskid={taskId} className="ToDoCard-options-menu-delete-btn" href="#">Delete</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                    }

                    <DatePicker
                        selected={startDateTime}
                        onChange={date => setTaskDateandTime(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeCaption="Time"
                        dateFormat={startDateTime ? (isToday(startDateTime) ? "'Today at' h:mm aa" : "MMMM d 'at' h:mm aa") : null}
                        customInput={<CalendarDateTimeSelectionInput />}
                        popperPlacement="top-start"
                        popperModifiers={{
                            offset: {
                                enabled: true,
                                offset: "-35px, 10px"
                            }
                        }}
                    />

                    {

                        taskDurationEditbox ?
                            <TimePicker
                                focusOnOpen={true}
                                open={true}
                                value={moment().hour(props.hours).minute(props.minutes)}
                                onChange={value => setTaskDuration(value)}
                                onClose={() => setTaskDurationEditbox(false)}
                                className="ToDoCard-duration-textfield"
                                popupClassName="TimePicker-duration-textfield-popup"
                                clearIcon={<span></span>}
                                placement="bottomLeft"
                                showSecond={false}
                                minuteStep={30} />
                            : <p onClick={() => isTaskInProgress ? null : setTaskDurationEditbox(true)} className="ToDoCard-duration">{props.duration}</p>
                    }
                </Col>
            </Row>
            <Row>
                <Col>
                    <p onBlur={e => setTaskContent(e, e.currentTarget.textContent, "title")} suppressContentEditableWarning={true} contentEditable={true} className="ToDoCard-title">{props.title}</p>
                    <p onBlur={e => setTaskContent(e, e.currentTarget.textContent, "description")} suppressContentEditableWarning={true} contentEditable={true} className="ToDoCard-description">{props.description}</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    {
                        props.tag ? <p className="ToDoCard-tag">{props.tag}</p> : ""
                    }
                    {
                        isTaskComplete ?
                            <img onClick={() => { handleTaskCompleteSatus(false) }} className="ToDoCard-completedIcon" alt="start icon" src="/Assets/Images/completedIcon.png" /> :
                            (
                                isTaskInProgress ? <Button onClick={handleFinishTask} taskid={taskId} className={cardButtonClass}>
                                    <img alt="start icon" src="/Assets/Images/finishTaskIcon.png" />
                            Finish
                                        </Button> :
                                    <Button disabled={props.anyTaskInProgress} onClick={handleStartTask} taskid={taskId} className={cardButtonClass}>
                                        <img alt="start icon" src="/Assets/Images/startTaskIcon.png" />
                                Start
                             </Button>
                            )

                    }
                </Col>
            </Row>
        </div>
    );
}

export default ToDoCard;