import React from 'react';
import { Container, Col, Row } from "react-bootstrap";
import ReactNotification from 'react-notifications-component'
import { store } from 'react-notifications-component';
import { firebase, database } from '../Firebase/firebase';

// import UpNext from '../Components/UpNext.js';
import { getWeekDateRange, NotifyOnUpcomingTask, ISODateString } from '../GlobalMethods';
import ProfileCard from '../Components/ProfileCard.js';
import TasksRoutinesTabMenu from '../Components/TasksRoutinesTabMenu.js';
import ProfileSettings from '../Modals/ProfileSettings.js';
import OverallProgressBar from '../Components/OverallProgressBar.js';
import Todos from '../Components/ToDos.js';
import TaskTimerCard from '../Components/TaskTimerCard';
import WeeklyDaySchedule from '../Components/WeeklyDaySchedule';
import { GoogleCalendarAuth, listMultipleCalendarEvents } from '../Actions/GoogleCalendarAuth';

import 'react-notifications-component/dist/theme.css'
import '../Styling/TasksPage.scss';

class TasksPage extends React.Component {


  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      displayName: "",
      photoURL: "",
      routines: [],
      tasks: [],
      tags: [],
      weeklyScheduleSettings: {
        getEventsOption: {
          isActive: true,
          selectedCalendars: []
        },
        updateEventsOption: {
          isActive: true,
          selectedCalendar: ""
        },
        autoSchedule: false
      },
      anyTaskInProgress: false,
      isProfileSettingsShown: false,
      tasksFilter: "To Do",
      weekDateRange: getWeekDateRange(0),
      selectedDate: new Date(),
      googleCalendarObj: {}
    };

    this.setWeekDateRange = this.setWeekDateRange.bind(this);
    this.setSelectedDate = this.setSelectedDate.bind(this);
    this.setProfileSettingsModal = this.setProfileSettingsModal.bind(this);
    this.setTasksPageDisplayName = this.setTasksPageDisplayName.bind(this);
    this.setTasksPagePhotoURL = this.setTasksPagePhotoURL.bind(this);
    this.setTasksFilter = this.setTasksFilter.bind(this);
    this.setPrimaryCalendar = this.setPrimaryCalendar.bind(this);
    this.getGoogleCalendarEvents = this.getGoogleCalendarEvents.bind(this);

    this.user = firebase.auth().currentUser;
  }

  componentDidMount() {

    var thisComponent = this;
    const userId = this.user.uid;
    const userDisplayName = this.user.displayName;
    const defaultWeeklyScheduleSettings = this.state.weeklyScheduleSettings;

    database.collection("users").doc(userId)
      .onSnapshot(function (doc) {
        if (doc.exists) {
          const data = doc.data();


          thisComponent.setState({
            displayName: userDisplayName,
            routines: data.routines ? data.routines : [],
            tasks: data.tasks ? data.tasks : [],
            tags: data.tags ? data.tags : [],
            anyTaskInProgress: data.anyTaskInProgress ? data.anyTaskInProgress : false,
            weeklyScheduleSettings: data.weeklyScheduleSettings ? data.weeklyScheduleSettings : defaultWeeklyScheduleSettings
          });

          // notifyOnUpcomingTask(data.tasks, 15);

        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      });

  }

  setWeekDateRange = (action) => {

    var weeksfromtoday = this.state.weekDateRange.weeksfromtoday;

    switch (action) {
      case "increment":
        weeksfromtoday++;
        break;
      case "decrement":
        weeksfromtoday--;
        break;
      default:
        break;
    }

    var weekDateRange = weeksfromtoday < 0 ? getWeekDateRange(weeksfromtoday, "past") : (weeksfromtoday === 0 ? getWeekDateRange(0) : getWeekDateRange(weeksfromtoday, "future"));

    this.setState((state) => ({
      weekDateRange,
      selectedDate: weekDateRange[weekDateRange.days.full[state.selectedDate.getDay()].toLowerCase()]
    }));

  }

  setSelectedDate = (selectedDate) => {
    this.setState({
      selectedDate
    })
  }


  setProfileSettingsModal = (status) => {
    this.setState({
      isProfileSettingsShown: status
    })
  }

  setTasksPageDisplayName = (displayname) => {
    this.setState({
      displayName: displayname
    })

    store.addNotification({
      title: "Hi " + displayname + "!",
      message: "Your new display name has been successfully updated!",
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 6000,
      }
    })
  }

  setTasksPagePhotoURL = (photourl) => {
    this.setState({
      photoURL: photourl
    })

    store.addNotification({
      title: "Looking good 😎",
      message: "Your new profile picture has been successfully updated!",
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 6000,
      }
    })
  }

  setTasksFilter = (e) => {

    var hasActiveClass = e.currentTarget.classList.contains("TasksPage-Filter-Item-Active");

    if (!hasActiveClass) {
      var selectedFilter = e.currentTarget.textContent;
      document.getElementsByClassName("TasksPage-Filter-Item-Active")[0].classList.remove("TasksPage-Filter-Item-Active");
      e.currentTarget.classList.add("TasksPage-Filter-Item-Active")

      this.setState({
        tasksFilter: selectedFilter
      })
    }

  }

  setPrimaryCalendar = (calendarId, calendarName) => {
    var weeklyScheduleSettings = this.state.weeklyScheduleSettings;

    if (!weeklyScheduleSettings.getEventsOption.selectedCalendars.includes(calendarId)) {
      weeklyScheduleSettings.getEventsOption.selectedCalendars.push(calendarId)
    }

    weeklyScheduleSettings.updateEventsOption.selectedCalendar = weeklyScheduleSettings.updateEventsOption.selectedCalendar ? weeklyScheduleSettings.updateEventsOption.selectedCalendar : calendarName

    database.collection("users").doc(this.user.uid).update({
      weeklyScheduleSettings
    })
      .then(function () {
        // console.log("Document successfully updated!");
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });

  }

  updateGoogleCalendarObject = (calendarObj) => {
    this.setState({
      googleCalendarObj: calendarObj,
    });
    //update firebase with google events from the selected week
    this.getGoogleCalendarEvents();
  }

  getGoogleCalendarEvents = () => {//!!this runs 3 times
    if (this.state.googleCalendarObj.isSignedIn) {

      const userId = this.user.uid;
      listMultipleCalendarEvents(this.state.weeklyScheduleSettings.getEventsOption.selectedCalendars, ISODateString(this.state.weekDateRange.sunday), ISODateString(this.state.weekDateRange.saturday)).then((calendarList) => {
        // console.log(calendarList)
        var tasks = this.state.tasks ? this.state.tasks : [];
        var routines = this.state.routines ? this.state.routines : [];

        //start fb write batch here
        var taskOrRoutineBatch = database.batch();

        calendarList.forEach(event => {

          var eventId = event.id;
          var splitEventId = eventId.split("-");

          var start = new Date(event.start.dateTime);
          var end = new Date(event.end.dateTime)
          var totalDurationInMinutes = (end.getTime() - start.getTime()) / 1000 / 60;

          var hours = ((totalDurationInMinutes - (totalDurationInMinutes % 60)) / 60).toString();
          var minutes = (totalDurationInMinutes % 60).toString();

          var doesTaskEventIdMatch = false;
          var doesRoutineEventIdMatch = false;

          //check if event has a task id format(task events have the word 'task' at the beginning of it)
          if (splitEventId[0] === "task") {//task event
            for (var s = 0; s < tasks.length; s++) {

              //check if the event already exists as a task in fb based on id match
              if (eventId === tasks[s].id) {//if exists update
                tasks[s].title = event.summary;
                tasks[s].description = event.description;
                tasks[s].hours = hours;
                tasks[s].minutes = minutes;
                doesTaskEventIdMatch = true;
              }
              //if no id match has been made a new task will be added to fb
              // if (!doesRoutineEventIdMatch) {
              // taskOrRoutineObj = {
              //     timestamp: new Date(),
              //     title: event.summary,
              //     description: event.description,
              //     tags: tags ? tags : "",
              //     hours: duration.format(durationFormat).toString().split(":")[0],
              //     minutes: duration.format(durationFormat).toString().split(":")[1],
              //     inProgress: false,
              //     completed: false,
              //     id: uuid(),
              // }
              //     var routineObj = {
              //         id: eventId,
              //         timestamp: new Date(),
              //         title: event.summary,
              //         hours: hours,
              //         minutes: minutes,
              //         startDateTime: start
              //     }
              //     routines.push(routineObj)
              // }

            }
            //add batch item here
            // var userDoc = database.collection("users").doc(user.uid);
            // taskOrRoutineBatch.update(userDoc, { "tasks": tasks });

          } else {//routine(regular event)

            for (var s = 0; s < routines.length; s++) {
              //check if the event already exists as a task in fb based on id match
              if (eventId === routines[s].id) {//if exists update
                routines[s].title = event.summary;
                // routines[s].description = event.description ? event.description : "";
                routines[s].hours = hours;
                routines[s].minutes = minutes;
                routines[s].startDateTime = start;
                doesRoutineEventIdMatch = true;
              }
            }
            //if no id match has been made a new routine will be added to fb
            if (!doesRoutineEventIdMatch) {
              var routineObj = {
                id: eventId,
                timestamp: new Date(),
                title: event.summary,
                hours: hours,
                minutes: minutes,
                startDateTime: start
              }
              routines.push(routineObj)
            }
            console.log(routines)

            //add batch item here
            var userDoc = database.collection("users").doc(userId);
            taskOrRoutineBatch.update(userDoc, { "routines": routines });
          }
        });
        //commit batch here
        taskOrRoutineBatch.commit().then(function () {
          // ...
        });
      })
    }
  }


  render() {
    // console.log("googleCalendarObj: ", this.state.googleCalendarObj);

    var firstLetter = this.user.email[0];
    var currentprofilepic = this.user.photoURL ? this.user.photoURL : "https://ui-avatars.com/api/?background=F2F3F3&color=579AB4&length=1&bold=true&font-size=0.7&name=" + firstLetter;
    var activeTask = this.state.tasks ? this.state.tasks.filter(task => task.inProgress) : false;

    var today = new Date();
    var weekDateRange = this.state.weekDateRange;
    var thisWeekDateRange = getWeekDateRange(0);
    var sunday = weekDateRange.months.abbr[weekDateRange.sunday.getMonth()] + " " + weekDateRange.sunday.getDate();
    var saturday = weekDateRange.months.abbr[weekDateRange.saturday.getMonth()] + " " + weekDateRange.saturday.getDate();
    var year = weekDateRange.saturday.getFullYear();

    var rangeStartDate = new Date(new Date(new Date(new Date(new Date(weekDateRange.sunday).setHours(0)).setMinutes(0)).setSeconds(0)).setMilliseconds(0)).getTime();
    var rangeEndDate = new Date(new Date(new Date(new Date(new Date(weekDateRange.saturday).setHours(23)).setMinutes(59)).setSeconds(0)).setMilliseconds(0)).getTime();

    return (
      <div className="App">
        {/* <GoogleCalendarAuth updatecalendarobj={this.updateGoogleCalendarObject} setprimarycalendar={this.setPrimaryCalendar} /> */}
        <ReactNotification className="Sail-Notification-Info" />
        {
          this.state.tasks.length ? <NotifyOnUpcomingTask tasks={this.state.tasks} minutestodeduct={15} /> : null
        }
        <ProfileSettings settaskspagephotourl={this.setTasksPagePhotoURL} settaskspagedisplayname={this.setTasksPageDisplayName} tags={this.state.tags} displayname={this.state.displayName ? this.state.displayName : this.user.displayName} email={this.user.email} currentprofilepic={currentprofilepic} show={this.state.isProfileSettingsShown} onHide={() => this.setProfileSettingsModal(false)} />

        <div className="TasksPage-Container">
          <div className="TasksPage-LeftPane-Container">
            <WeeklyDaySchedule /*googlecalendarobj={this.state.googleCalendarObj}*/ routines={this.state.routines} tasks={this.state.tasks} weekDateRange={weekDateRange} selectedDate={this.state.selectedDate} setselecteddate={this.setSelectedDate} weeklyschedulesettings={this.state.weeklyScheduleSettings} />
          </div>
          <div className="TasksPage-Main-Container">
            <div className="TasksPage-Dashboard-Container">
              <Row>
                <Col className="text-left">
                  <img onClick={() => this.setWeekDateRange("decrement")} className="TasksPage-Week-Navigation-Left-Btn" src="Assets\Images\right-arrow_icon.png" alt="week left-arrow button" />
                  <p className="TasksPage-Week-Navigation-Dates">{`${sunday} - ${saturday}, ${year}`}</p>
                  <img onClick={() => this.setWeekDateRange("increment")} className="TasksPage-Week-Navigation-Right-Btn" src="Assets\Images\right-arrow_icon.png" alt="week right-arrow button" />
                  <button onClick={() => { this.setState((state) => ({ weekDateRange: thisWeekDateRange, selectedDate: thisWeekDateRange[thisWeekDateRange.days.full[state.selectedDate.getDay()].toLowerCase()] })) }} type="button" className={rangeStartDate <= today && today < rangeEndDate ? "TasksPage-Week-Navigation-ThisWeek-Btn TasksPage-Week-Navigation-ThisWeek-Btn-Active btn btn-primary" : "TasksPage-Week-Navigation-ThisWeek-Btn btn btn-primary"}>This Week</button>
                </Col>
              </Row>
              <Row>
                <Col className="text-left">
                  <p className="TasksPage-Title">My Tasks</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <OverallProgressBar weekDateRange={this.state.weekDateRange} tasks={this.state.tasks} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="TasksPage-Filters-Container">
                    <p onClick={this.setTasksFilter} className="TasksPage-Filter-Item TasksPage-Filter-Item-Active">To Do</p>
                    <p onClick={this.setTasksFilter} className="TasksPage-Filter-Item">Completed</p>
                    <p onClick={this.setTasksFilter} className="TasksPage-Filter-Item">All</p>
                  </div>
                </Col>
              </Row>

              <Todos weekDateRange={this.state.weekDateRange} tasksFilter={this.state.tasksFilter} tasks={this.state.tasks} anyTaskInProgress={this.state.anyTaskInProgress} />
              
              {
                activeTask[0] ? <TaskTimerCard tasks={this.state.tasks} /> : null
              }

            </div>
          </div>
          <div className="TasksPage-RightPane-Container">
            <ProfileCard setprofilesettingsmodal={() => this.setProfileSettingsModal(true)} currentprofilepic={currentprofilepic} displayname={this.state.displayName ? this.state.displayName : this.user.displayName} email={this.user.email} />
            <TasksRoutinesTabMenu tags={this.state.tags} tasks={this.state.tasks} />
          </div>
        </div>
      </div>
    );
  }

}

export default TasksPage;