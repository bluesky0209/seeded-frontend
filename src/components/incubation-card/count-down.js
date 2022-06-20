import React, { useState, useEffect } from 'react'

const CountDown = (props) => {
    const [timeFormat, setTimeFormat] = useState('0d 0h 0m 0s');
    const timeCount = setInterval(function () {
        let now = new Date().getTime();
        let countDownDate = new Date(props.startDate + " " + props.startTime).getTime();
        let distance = countDownDate - now;
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeFormat(days + "d " + hours + "h "
            + minutes + "m " + seconds + "s");
        if (distance < 0) {
            clearInterval(timeCount);
            setTimeFormat("0d 0h 0m 0s");
        }
    }, 1000);
    return (
        <div>{timeFormat}</div>
    )
}
export default CountDown;