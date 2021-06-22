import React from 'react';
import { Col, Row, Overlay, Tooltip } from 'react-bootstrap';

import { truncateString } from '../GlobalMethods';

import '../Styling/WeeklyDayEventCard.scss';

function WeeklyDayEventCard(props) {

    const [showInfoTooltip, setShowInfoTooltip] = React.useState(false);
    const target = React.useRef(null);

    const title = props.title;
    return (
        <div className="WeeklyDayEventCard-Container">
            <div className="WeeklyDayEventCard-Header">
                <Row noGutters="true">
                    <Col lg={8}>
                        <p className="WeeklyDayEventCard-title" ref={target} onMouseLeave={() => setShowInfoTooltip(false)} onMouseEnter={() => setShowInfoTooltip(true)} >{truncateString(title, 50)}</p>
                        <Overlay target={target.current} show={showInfoTooltip} placement="top-end">
                            {(props) => (
                                <Tooltip className="Sail-info-tooltip" {...props}>
                                    {title}
                                </Tooltip>
                            )}
                        </Overlay>
                    </Col>
                    <Col lg={4}>
                        <p className="WeeklyDayEventCard-duration">{props.duration}</p>
                    </Col>
                </Row>
            </div>

            <div className="WeeklyDayEventCard-Footer">
                <div className="WeeklyDayEventCard-eventType-container">
                    <img className={props.type === "routine" ? "WeeklyDayEventCard-routine-icon" : "WeeklyDayEventCard-task-icon"} src={props.type === "routine" ? "Assets/Images/routines_icon.png" : "Assets/Images/tasks_icon.png"} alt="event type icon" />
                </div>
                {
                    props.completed ? <img className="WeeklyDayEventCard-status-icon" src="Assets/Images/completedIcon.png" alt="completed icon" /> : null
                }
            </div>
        </div>
    )
}

export default WeeklyDayEventCard;