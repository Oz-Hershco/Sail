import React from 'react';
import { store } from 'react-notifications-component';
import Notifier from "react-desktop-notification";

const hasEmptySpaces = (str) => {
    return (/^ *$/.test(str));
}

const truncateString = (str, num) => {
    // If the length of str is less than or equal to num
    // just return str--don't truncate it.
    if (str.length <= num) {
      return str
    }
    // Return str truncated with '...' concatenated to the end of str.
    return str.slice(0, num) + '...'
}

const getWeekDateRange = (weeksfromtoday, action) => {

var weeksmultiplier = Math.abs(weeksfromtoday) * 7;
var todayWeeksFromNow = new Date();
var pastPresentOrFutureToday;

    switch(action){
        case "future":
            pastPresentOrFutureToday = new Date(new Date().setDate(todayWeeksFromNow.getDate() + weeksmultiplier));
        break;
        case "past":
            pastPresentOrFutureToday = new Date(new Date().setDate(todayWeeksFromNow.getDate() - weeksmultiplier));
        break;
        default:
            pastPresentOrFutureToday = new Date();
        break;
    }
    var today = pastPresentOrFutureToday;
    var dayToday = today.getDay();
    var sunday = new Date(new Date(pastPresentOrFutureToday).setDate(today.getDate() - dayToday));
    var monday = new Date(new Date(pastPresentOrFutureToday).setDate(today.getDate() + (1 - dayToday)));
    var tuesday = new Date(new Date(pastPresentOrFutureToday).setDate(today.getDate() + (2 - dayToday)));
    var wednesday = new Date(new Date(pastPresentOrFutureToday).setDate(today.getDate() + (3 - dayToday)));
    var thursday = new Date(new Date(pastPresentOrFutureToday).setDate(today.getDate() + (4 - dayToday)));
    var friday = new Date(new Date(pastPresentOrFutureToday).setDate(today.getDate() + (5 - dayToday)));
    var saturday = new Date(new Date(pastPresentOrFutureToday).setDate(today.getDate() + (6 - dayToday)));

    var weekDateRange = {
        sunday,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        months: {
            abbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            full: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        },
        days: {
            abbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        },
        weeksfromtoday: weeksfromtoday
    }

    return weekDateRange;

}

const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
}


class NotifyOnUpcomingTask extends React.Component {
    constructor() {
        super();
        this.state = {
            currentTime: '',
            reminderTime: '',
            closestTask: ''
        };

        
    }

    componentDidMount() {

        this.updateClosestTask();

        this.clock = setInterval(
            () => this.setCurrentTime(),
            1000
        )
        this.interval = setInterval(
            () => this.checkTimeToRemind(),
            1000)
    }

    componentWillUnmount() {
        clearInterval(this.clock);
        clearInterval(this.interval);
    }

    setCurrentTime() {
        this.updateClosestTask();
        this.setState({
            currentTime: new Date().toLocaleTimeString('en-US', { hour12: false })
        });
    }

    updateClosestTask(){
        var tasks = this.props.tasks;

        var now = new Date();
        
        let closest = Infinity;
        let closestTask = "";

        tasks.forEach(function (task) {

            if(task.startDateTime){
                const date = new Date(task.startDateTime.seconds * 1000);

                if (date >= now && (date < new Date(closest) || date < closest)) {
                    closest = task.startDateTime.seconds * 1000;
                    closestTask = task;
                }
            }

        });

        var timeToRemind = new Date(closest - (this.props.minutestodeduct * 60000));

        this.setState({
            reminderTime: timeToRemind.toLocaleTimeString('en-US', { hour12: false }),
            closestTask
        })
    }

    checkTimeToRemind() {

        if (this.state.currentTime === this.state.reminderTime && isToday(new Date(this.state.closestTask.startDateTime.seconds * 1000))) {

            if(!this.state.closestTask.completed){
                store.addNotification({
                    title: "Task Reminder",
                    message: <TaskReminderMessage tasktitle={this.state.closestTask.title} taskstarttime={new Date(this.state.closestTask.startDateTime.seconds * 1000).toLocaleTimeString('en-US',{ hour: '2-digit', minute: '2-digit' })}/>,
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    delay: 0,
                    dismiss: {
                        duration: 0,
                        click: true,
                        showIcon: true,
                    }
                });

                Notifier.focus("Time to work on the next one!" ,"Check it out! It's almost time to work on " + this.state.closestTask.title + " task, starting at " + new Date(this.state.closestTask.startDateTime.seconds * 1000).toLocaleTimeString('en-US',{ hour: '2-digit', minute: '2-digit' }),"","/Assets/Images/timerbackground.png");
            }

        } else {
            // console.log("not yet");
            // console.log(this.state.currentTime);
            // console.log(this.state.reminderTime);
        }
    }

    render() {
        return (
            <div>

            </div>
        );
    }
}


function TaskReminderMessage(props){
    return(
        <span>
        It's almost time to start working on <b>{props.tasktitle}</b> task starting at {props.taskstarttime}
    </span>
    );
}

function NotifyOnStartedTask(task, tasks, database, user){

     if(task){
        store.addNotification({
            title: task.title + " Started",
            message: <TaskStartedMessage undo={undoTask} task={task} />,
            type: "success",
            insert: "top",
            container: "top-right",
            dismiss: {
              duration: 7000,
              click: true,
              showIcon: true,
            }
        })
     }
    
     function undoTask(){

        for (var s = 0; s < tasks.length; s++) {

            tasks[s].inProgress = false;
        }

        return database.collection("users").doc(user.uid).update({
            tasks: tasks,
            anyTaskInProgress: false
        })
            .then(function () {
                console.log("Document successfully updated!");
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });

            }
}

function TaskStartedMessage(props){

    return(
        <span>
        Timer for the <b>{props.task.title}</b> task just started.
        <div className="Sail-Notification-UndoAction-Button-Container">
          <p onClick={props.undo} className="Sail-Notification-UndoAction-Button-Text">Undo this action</p>
          <img onClick={props.undo} className="Sail-Notification-UndoAction-Button-Icon" src="Assets/Images/undo_icon.png" alt="Undo action button icon" />
        </div>
    </span>
    );
}

function ISODateString(d){

    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
         + pad(d.getUTCMonth()+1)+'-'
         + pad(d.getUTCDate())+'T'
         + pad(d.getUTCHours())+':'
         + pad(d.getUTCMinutes())+':'
         + pad(d.getUTCSeconds())+'Z'
}


export { getWeekDateRange, isToday, NotifyOnUpcomingTask, NotifyOnStartedTask, hasEmptySpaces, truncateString, ISODateString }

