import React from 'react'
import { Tabs, Tab } from "react-bootstrap";

import AddRoutineForm from '../Components/AddRoutineForm.js';
import AddTaskForm from '../Components/AddTaskForm.js';

import '../Styling/TasksRoutinesTabMenu.scss';

function TasksRoutinesTabMenu(props) {

    return (
        <div>
            <Tabs defaultActiveKey="tasks" transition={false} id="TasksRoutinesTabMenu" className="TasksRoutinesTabMenu nav-fill">
                <Tab eventKey="tasks" title="Add Tasks">
                    <AddTaskForm tags={props.tags} tasks={props.tasks} />
                </Tab>
                <Tab eventKey="routines" title="Add Routines">
                    <AddRoutineForm />
                </Tab>
            </Tabs>
        </div>
    )
}

export default TasksRoutinesTabMenu;