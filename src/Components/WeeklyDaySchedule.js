import React from 'react';
import { Col, Row } from 'react-bootstrap';

import WeeklyScheduleSettings from '../Modals/WeeklyScheduleSettings';
import WeeklyDayEventCard from './WeeklyDayEventCard';

import '../Styling/WeeklyDaySchedule.scss';

function WeeklyDaySchedule(props) {

    const [isCalendarSycnSettingsShown, setCalendarSycnSettingsModal] = React.useState(false);

    // var now = new Date();
    // var currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    // var totalMinutesInADay = 24*60;

    // document.getElementById("WeeklyDaySchedule-schedule-events-current-time-line").style.top = currentTimeInMinutes/totalMinutesInADay * 100 + "%";
    var dailyTimesArr = [];

    var selectedDateTasks = props.tasks ? props.tasks.filter((task) => {

        var taskStartDateTime = task.startDateTime ? new Date(task.startDateTime.seconds * 1000) : "";
        task.type = "task";
        return taskStartDateTime && taskStartDateTime.getDate() === props.selectedDate.getDate() &&
            taskStartDateTime.getMonth() === props.selectedDate.getMonth() &&
            taskStartDateTime.getFullYear() === props.selectedDate.getFullYear()

    }) : [];

    var selectedDateRoutines = props.routines ? props.routines.filter((routine) => {

        var routineStartDateTime = routine.startDateTime ? new Date(routine.startDateTime.seconds * 1000) : "";
        routine.type = "routine";
        return routineStartDateTime && routineStartDateTime.getDate() === props.selectedDate.getDate() &&
            routineStartDateTime.getMonth() === props.selectedDate.getMonth() &&
            routineStartDateTime.getFullYear() === props.selectedDate.getFullYear()

    }) : [];

    var selectedDateEvents = [...selectedDateTasks, ...selectedDateRoutines];

    var weekDateRangeText = props.weekDateRange.months.abbr[props.weekDateRange.sunday.getMonth()] + " " + props.weekDateRange.sunday.getDate() + " - " + props.weekDateRange.months.abbr[props.weekDateRange.saturday.getMonth()] + " " + props.weekDateRange.saturday.getDate() + ", " + props.weekDateRange.saturday.getFullYear();
    var selectedDay = props.weekDateRange.days.full[props.selectedDate.getDay()].toLowerCase();

    for (var t = 0; t < 24; t++) {
        dailyTimesArr.push({ timeslot: t + ":00" })
        dailyTimesArr.push({ timeslot: t + ":30" })
    }

    for (var c = 0; c < dailyTimesArr.length; c++) {

        var timeofdayInMinutes = parseInt(dailyTimesArr[c].timeslot.split(":")[0]) * 60 + parseInt(dailyTimesArr[c].timeslot.split(":")[1]);

        for (var e = 0; e < selectedDateEvents.length; e++) {
            var taskStartDateTime = selectedDateEvents[e].startDateTime ? new Date(selectedDateEvents[e].startDateTime.seconds * 1000) : "";
            var taskStartTimeInMinutes = taskStartDateTime ? taskStartDateTime.getHours() * 60 + taskStartDateTime.getMinutes() : "";
            var taskDuration = (parseInt(selectedDateEvents[e].hours * 60) + parseInt(selectedDateEvents[e].minutes)) / 30;

            //check if start time has an event 
            if (timeofdayInMinutes === taskStartTimeInMinutes) {//if has event 
                dailyTimesArr[c].slotType = "event";
                dailyTimesArr[c].duration = taskDuration;
                dailyTimesArr[c].eventDetails = selectedDateEvents[e];
                c++;
            }
        }
    }

    document.getElementById("WeeklyDaySchedule-schedule-events-current-time-line") ? document.getElementById("WeeklyDaySchedule-schedule-events-current-time-line").scrollIntoView() : document.getElementById("WeeklyDaySchedule-schedule-events-current-time-line");

    return (
        <div>
            {/* <WeeklyScheduleSettings weeklyschedulesettings={props.weeklyschedulesettings} setprimarycalendar={props.setprimarycalendar} show={isCalendarSycnSettingsShown} onHide={() => setCalendarSycnSettingsModal(false)} /> */}
            <div className="WeeklyDaySchedule-Container">
                <div className="WeeklyDaySchedule-Header">
                    <div className="WeeklyDaySchedule-Header-Left">
                        <p className="WeeklyDaySchedule-title">Weekly Schedule</p>
                        <p className="WeeklyDaySchedule-daterange">{weekDateRangeText}</p>
                    </div>
                    <div className="WeeklyDaySchedule-Header-Right">
                        {/* <img onClick={() => { setCalendarSycnSettingsModal(true) }} className="WeeklyDaySchedule-CalenderSyncSettingsBtn" src="Assets/Images/calendarsyncsettings_icon.png" alt="calendar sync settings button" /> */}
                    </div>
                </div>
                <div className="WeeklyDaySchedule-Body">
                    <Row noGutters={true}>
                        <Col className="WeeklyDaySchedule-day-btns-container" md={2}>
                            {
                                props.weekDateRange.days.full.map((day, i) => {

                                    var fullday = day.toString().toLowerCase();
                                    var abbrday = props.weekDateRange.days.abbr[i];
                                    var selecteddayabbr = props.weekDateRange.days.abbr[props.selectedDate.getDay()];
                                    return (
                                        <div onClick={e => props.setselecteddate(props.weekDateRange[e.currentTarget.getAttribute("day")])} key={i} day={fullday} className={selecteddayabbr === abbrday ? "WeeklyDaySchedule-day-btn WeeklyDaySchedule-day-btn-active" : "WeeklyDaySchedule-day-btn"}>
                                            <p className="WeeklyDaySchedule-day-btn-date">{props.weekDateRange[fullday].getDate()}</p>
                                            <p className="WeeklyDaySchedule-day-btn-day">{abbrday}</p>
                                        </div>)
                                })
                            }

                        </Col>
                        <Col md={10} className="WeeklyDaySchedule-schedule-container">
                            <Row noGutters={true}>
                                <Col>
                                    <div className="WeeklyDaySchedule-schedule-selected-date-container">
                                        <p className="WeeklyDaySchedule-schedule-selected-date">{`${props.weekDateRange.days.full[props.weekDateRange[selectedDay].getDay()]}, ${props.weekDateRange.months.abbr[props.weekDateRange[selectedDay].getMonth()]} ${props.weekDateRange[selectedDay].getDate()}`}</p>
                                    </div>
                                </Col>
                            </Row>
                            <Row noGutters={true}>
                                <Col>
                                    <div className="WeeklyDaySchedule-schedule-events-container">
                                        <table>
                                            <tbody>
                                                {
                                                    dailyTimesArr.map((timeObj, i) => {

                                                        var now = new Date();
                                                        var currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
                                                        var timeofdayInMinutes = parseInt(timeObj.timeslot.split(":")[0]) * 60 + parseInt(timeObj.timeslot.split(":")[1]);;

                                                        var eventTD;
                                                        var nowTimeBar = timeofdayInMinutes < currentTimeInMinutes && currentTimeInMinutes < timeofdayInMinutes + 30 ? (<div id="WeeklyDaySchedule-schedule-events-current-time-line"></div>) : null;
                                                        switch (timeObj.slotType) {
                                                            case "event":
                                                                var eventDuration = timeObj.duration / 2;
                                                                var eventDetails = timeObj.eventDetails;
                                                                eventTD = (
                                                                    <td rowSpan={timeObj.duration} className="WeeklyDaySchedule-schedule-events-filledtimeslot">
                                                                        <WeeklyDayEventCard completed={eventDetails.completed} title={eventDetails.title} duration={eventDuration + "Hrs"} type={eventDetails.type} />
                                                                        {nowTimeBar}
                                                                    </td>
                                                                )
                                                                break;
                                                            case "merge":
                                                                eventTD = <td>{nowTimeBar}</td>;
                                                                break;
                                                            default:
                                                                eventTD = (
                                                                    <td className="WeeklyDaySchedule-schedule-events-emptytimeslot-line">
                                                                        {nowTimeBar}
                                                                    </td>
                                                                )
                                                                break;
                                                        }

                                                        return (
                                                            <tr key={i}>
                                                                <td>
                                                                    <p className="WeeklyDaySchedule-schedule-events-timeslot">{timeObj.timeslot}</p>
                                                                </td>
                                                                {eventTD}
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>

                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}


export default WeeklyDaySchedule;