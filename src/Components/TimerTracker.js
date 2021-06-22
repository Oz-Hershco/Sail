import React from 'react';
import Timer from 'react-compound-timer';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import '../Styling/TimerTracker.scss';

class TimerTracker extends React.Component {
    
    constructor(props) {
        super(props);

        var now = new Date();
        var startingTime = this.props.startingTime ? this.props.startingTime.toDate() : 0;
        this.timePassedSoFar = this.props.startingTime ? Math.ceil((now.getTime() - startingTime.getTime())) : 0;

      }

    componentDidMount() {


        this.timer = this.timePassedSoFar ? this.timePassedSoFar/1000 : 0;
        this.taskDuration = this.props.duration;
        this.progressPercentage = this.timePassedSoFar ? this.timer / this.taskDuration * 100 : 0;
        
        this.CircularProgressBarInterval = setInterval(() => {
            if (this.taskDuration < this.timer) {
                clearInterval(this.CircularProgressBarInterval);
            } else {
                this.timer++
                this.progressPercentage = this.timer / this.taskDuration * 100;
            }
            // console.log("counting");
        }, 1000);

    }


    componentWillUnmount() {
        clearInterval(this.CircularProgressBarInterval);
    }

    render() {


        // console.log("timePassedSoFar:",this.timePassedSoFar)


        return (
            <div>
                <Timer initialTime={this.timePassedSoFar} formatValue={value => `${value < 0 ? "00" : (value < 10 ? `0${value}` : value)}`}
                    // checkpoints={[
                    //     {
                    //         time: 1000,
                    //         callback: () => console.log('Checkpoint A: ', this.progressPercentage),
                    //     }
                    // ]}
                >
                    {({ start, resume, pause, stop, reset, timerState }) => (

                        <React.Fragment>
                            {
                                this.taskDuration < this.timer ?
                                    <p className="Timer-time-text">
                                        Time's up!
                                    </p> :
                                    <p className="Timer-time-text">
                                        <Timer.Hours />:<Timer.Minutes />:<Timer.Seconds />
                                    </p>
                            }

                            <div>
                                <CircularProgressbar className="TimerTracker-CircularProgressbar" value={this.progressPercentage} strokeWidth="2" styles={buildStyles({
                                    // Rotation of path and trail, in number of turns (0-1)
                                    rotation: 0,

                                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                    strokeLinecap: 'butt',

                                    // How long animation takes to go from one percentage to another, in seconds
                                    pathTransitionDuration: 0.2,

                                    path: {
                                        // Path color
                                        stroke: `#579AB4`,
                                        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                        strokeLinecap: 'butt',
                                        // Customize transition animation
                                        transition: 'stroke-dashoffset .7s ease 0s',
                                        // Rotate the path
                                        transform: 'rotate(0.25turn)',
                                        transformOrigin: 'center center'
                                    },

                                    // Can specify path transition in more detail, or remove it entirely
                                    // pathTransition: 'none',

                                    // Colors
                                    trailColor: '#d6d6d6',
                                    backgroundImage: "url('/Assets/Images/animatedlogo.gif')"
                                })} />
                            </div>
                        </React.Fragment>
                    )}

                </Timer>
            </div>
        )
    }


}

export default TimerTracker;