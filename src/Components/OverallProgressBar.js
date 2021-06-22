import React from 'react';
import { ProgressBar } from 'react-bootstrap';

import '../Styling/OverallProgressBar.scss'

function OverallProgressBar(props) {

    var tasks = props.tasks;
    var selectedWeekDateRange = props.weekDateRange;
    var tasksProgressPercentage = 0;

    if (tasks) {
        var selectedWeekTasks = tasks.filter(task => {
            var startDateTime = task.startDateTime ? task.startDateTime.toDate() : task.timestamp;
            var rangeStartDate =  new Date(new Date(new Date(new Date(new Date(selectedWeekDateRange.sunday).setHours(0)).setMinutes(0)).setSeconds(0)).setMilliseconds(0)).getTime();
            var rangeEndDate =  new Date(new Date(new Date(new Date(new Date(selectedWeekDateRange.saturday).setHours(23)).setMinutes(59)).setSeconds(0)).setMilliseconds(0)).getTime();
            return (rangeStartDate <= startDateTime && startDateTime < rangeEndDate);
        });
        var completedTasks = selectedWeekTasks.filter(task => task.completed).length;
        tasksProgressPercentage = selectedWeekTasks.length ? (completedTasks / selectedWeekTasks.length) * 100 : 0;
    }

    return (
        <div>
            <div className="OverallProgressBar-Bar-Container">
                <div className="OverallProgressBar-Bar-Header-Wrapper">
                    <p className="OverallProgressBar-Bar-title">Overall Progress</p>
                    <ProgressBar className="OverallProgressBar-Bar" now={tasksProgressPercentage} />
                </div>
                <p className="OverallProgressBar-Bar-Percentage">{tasksProgressPercentage.toFixed(0)}%</p>
            </div>
        </div>
    )
}

export default OverallProgressBar;