import React from 'react';
import { Col, Row } from "react-bootstrap";
import Timer from 'react-compound-timer';

import TimerTracker from './TimerTracker';
import ToDoCard from './ToDoCard';

import { truncateString } from '../GlobalMethods';

import '../Styling/TaskTimerCard.scss';

function TaskTimerCard(props) {


    const [isopen, setIsOpen] = React.useState(true);


    var isTaskInProgress = false;

    var activeTask = props.tasks ? props.tasks.filter(task => task.inProgress) : false;
    var startDateTime;
    var duration;
    var durationInMin;
    var title;
    var description;
    var tags;
    var taskId;
    var completed;
    var startingTime;
    var timePassedSoFar;

    if (activeTask[0]) {
        var minutes = parseInt(activeTask[0].minutes);
        var hours = parseInt(activeTask[0].hours);
        var minutesPronounciation = minutes ? (minutes < 2 ? " min" : " mins") : "";
        var hoursPronounciation = hours ? (hours < 2 ? " hr" : " hrs") : "";
        isTaskInProgress = activeTask[0].inProgress;
        startDateTime = activeTask[0].startDateTime;
        duration = minutes > 0 && hours > 0 ? hours + hoursPronounciation + " and " + minutes + minutesPronounciation : minutes > 0 ? minutes + minutesPronounciation : (hours > 0 ? hours + hoursPronounciation : "");
        durationInMin = (hours * 60 + minutes) * 60;
        title = activeTask[0].title;
        description = activeTask[0].description;
        tags = activeTask[0].tags;
        completed = activeTask[0].completed;
        taskId = activeTask[0].id;
        startingTime = activeTask[0].startingTime;
        var now = new Date();
        timePassedSoFar = startingTime ? Math.ceil((now.getTime() - startingTime.toDate().getTime())) : 0;
    }

    return (
        <div>
            <div className={isopen ? "TasksPage-TaskTracker-Wrapper-Opened" : "TasksPage-TaskTracker-Wrapper-Closed"}>
                <div onClick={() => { setIsOpen(!isopen) }} className="TaskTimerCard-header">
                    <Row>
                        <Col md={12}>
                            <img className="TaskTimerCard-timer-icon" src="Assets/Images/timer_icon.png" alt="timer icon" />
                            <p className="TaskTimerCard-title">Timer</p>
                            {
                                isopen ? null :
                                    <Timer initialTime={timePassedSoFar} formatValue={value => `${value < 0 ? "00" : (value < 10 ? `0${value}` : value)}`}>
                                        {({ start, resume, pause, stop, reset, timerState, getTime }) => (
                                            <React.Fragment>
                                                {

                                                    durationInMin < getTime() / 1000 ?
                                                        <p className="TaskTimerCardTab-time-text">
                                                            Time's up!
                                                    </p> :
                                                        <p className="TaskTimerCardTab-time-text">
                                                            <Timer.Hours />:<Timer.Minutes />:<Timer.Seconds />
                                                        </p>

                                                }
                                            </React.Fragment>

                                        )}

                                    </Timer>
                            }
                            <img className="TaskTimerCard-collapsible-icon" src={isopen ? "Assets/Images/minus_icon.png" : "Assets/Images/plus_icon.png"} alt="collapsible icon" />
                        </Col>
                    </Row>
                </div>
                <div className="TaskTimerCard-container">


                    {
                        isTaskInProgress && !completed ?
                            <div>
                                <TimerTracker startingTime={startingTime} isTaskInProgress={isTaskInProgress} duration={durationInMin} />
                                <hr />
                                <ToDoCard tasks={props.tasks} taskid={taskId} isTaskInProgress={isTaskInProgress} startDateTime={startDateTime} duration={duration} title={title} description={truncateString(description, 60)} tag={tags} />
                            </div>
                            :
                            <Row>
                                <Col className="text-center" md={12}>
                                    <img className="TaskTimerCard-nothingtoshow-image" alt="no active tasks to show" src="/Assets/Images/noactivetask_img.png" />
                                    <p className="TaskTimerCard-nothingtoshow">No tasks are being handled at the moment</p>
                                </Col>
                            </Row>
                    }

                </div>
            </div>
        </div>
    );
}

export default TaskTimerCard;