import React from 'react';
import Moment from 'react-moment';

import RoutineCard from './RoutineCard';
import ToDoCard from './ToDoCard';

import '../Styling/ScheduleDayCard.scss';

function ScheduleDayCard(props) {

    var tasks = props.tasks;
    var routines = props.routines;
    var day = props.day;
    var date = props.date;

    let routineCards = routines.map((routine, i) => {
        var duration = routine.duration;
        var hour = routine.hours < 10 ? "0" + routine.hours : routine.hours;
        var dueHour = parseInt(routine.hours) + parseInt(duration) > 24 ? parseInt(routine.hours) + parseInt(duration) - 24 : parseInt(routine.hours) + parseInt(duration);
        var minutes = routine.minutes < 10 ? "0" + routine.minutes : routine.minutes;
        var routineTime = hour + ":" + minutes;
        var routineDueTime = dueHour + ":" + minutes;
        return (
            <RoutineCard key={i} routineTime={routineTime + "-" + routineDueTime} routineDuration={duration} routineTitle={routine.title} />
        );
    });

    let taskCards = tasks.map((task, i) => {
        var startDateTime = task.startDateTime ? task.startDateTime : "TBD";
        var duration = task.minutes > 0 ? task.hours + " hours and " + (task.minutes < 2 ? task.minutes + " minute" : task.minutes + " minutes") : (task.hours < 2 ? task.hours + " hour" : task.hours + " hours");
        var isTaskInProgress = task.inProgress;
        var completed = task.completed;
        var taskid = task.id;
        return (
            <ToDoCard anyTaskInProgress={props.anyTaskInProgress} tasks={tasks} taskid={taskid} completed={completed} isTaskInProgress={isTaskInProgress} key={i} startDateTime={startDateTime} duration={duration} title={task.title} description={task.description} tag={task.tags} />
        );
    });

    return (
        <div className="ScheduleDayCard-container">
            <div className="ScheduleDayCard-header">
                <p className={tasks.length || routines.length ? "ScheduleDayCard-day-title some-schedule-today" : "ScheduleDayCard-day-title no-schedule-today"}>{day}</p>
                <p className="ScheduleDayCard-date">
                    <Moment format="MMMM">{date}</Moment> {date}
                </p>
            </div>
            {
                tasks.length || routines.length ?
                    routineCards :
                    <p className="ScheduleDayCard-nothingtoshow">Nothing happening this day.</p>
            }
            {
                taskCards
            }
        </div>

    )
}

export default ScheduleDayCard;