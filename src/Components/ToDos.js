import React from 'react';
import { Col, Row } from "react-bootstrap";

import ToDoCard from './ToDoCard';

import '../Styling/ToDos.scss';

function ToDos(props) {

    // var tasks = props.tasks.reverse();
    var tasks = props.tasks;
    var tasksFilter = props.tasksFilter;
    var selectedWeekDateRange = props.weekDateRange;
    let taskCards;

    if (tasks) {

        taskCards = tasks.sort((a, b) => {
            var starDateA = a.startDateTime ? a.startDateTime.seconds * 1000 : 0;
            var starDateB = b.startDateTime ? b.startDateTime.seconds * 1000 : 0;
            var dateA = new Date(starDateA), dateB = new Date(starDateB);
            return dateA - dateB;
        }).filter(task => {
            var startDateTime = task.startDateTime ? task.startDateTime.toDate() : task.timestamp.toDate();
            var rangeStartDate = new Date(new Date(new Date(new Date(new Date(selectedWeekDateRange.sunday).setHours(0)).setMinutes(0)).setSeconds(0)).setMilliseconds(0)).getTime();
            var rangeEndDate = new Date(new Date(new Date(new Date(new Date(selectedWeekDateRange.saturday).setHours(23)).setMinutes(59)).setSeconds(0)).setMilliseconds(0)).getTime();

            return (rangeStartDate <= startDateTime && startDateTime < rangeEndDate);
        }).filter(task => tasksFilter === "To Do" ? !task.completed : (tasksFilter === "Completed" ? task.completed : true)).map((task, i) => {
            var hours = task.hours < 10 ? task.hours.substr(1, 1) : task.hours;
            var minutes = task.minutes < 10 ? task.minutes.substr(1, 1) : task.minutes;
            var minutesPronounciation = minutes ? (minutes < 2 ? " min" : " mins") : "";
            var hoursPronounciation = hours ? (hours < 2 ? " hr" : " hrs") : "";

            var startDateTime = task.startDateTime;
            var duration = minutes > 0 && hours > 0 ? hours + hoursPronounciation + " and " + minutes + minutesPronounciation : minutes > 0 ? minutes + minutesPronounciation : (hours > 0 ? hours + hoursPronounciation : "");

            // console.log(duration)
            var isTaskInProgress = task.inProgress;
            var completed = task.completed;
            var taskid = task.id;
            return (
                <ToDoCard minutes={task.minutes} hours={task.hours} anyTaskInProgress={props.anyTaskInProgress} tasks={tasks} taskid={taskid} completed={completed} isTaskInProgress={isTaskInProgress} key={i} startDateTime={startDateTime} duration={duration} title={task.title} description={task.description} tag={task.tags} />
            );
        });

    }

    return (
        <div>
            <div className="ToDos-container">
                {
                    taskCards ?
                        <div className="ToDos-cards-wrapper">{taskCards}</div> :
                        <div>
                            <hr />
                            <Row>
                                <Col md={12}>
                                    <p className="ToDoCard-nothingtoshow">Nothing to do for now. Add a new task!</p>
                                </Col>
                            </Row>
                        </div>
                }

            </div>
        </div>
    );
}

export default ToDos;