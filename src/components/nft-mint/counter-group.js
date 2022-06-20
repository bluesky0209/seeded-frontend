import React from "react";
import { ButtonGroup, Button, Input, TextField } from "@mui/material";

export default function CounterGroup(props) {

    const [counter, setCounter] = React.useState(1);
  
    function changeCounter(val) {
        props.changeCounter(val)
        setCounter(val)
    }

    return (
    <ButtonGroup style={{borderWidth: 0, paddingLeft: 10}} size="small" aria-label="small outlined button group">
        <Button key={1} style={{ width: 25, marginRight: 2, borderColor: '#0CF3A8', borderWidth: 1, color: '#ffffff', fontSize: 14}} disabled={counter > props.maxValue}  disabled={counter < 1} onClick={() => changeCounter(counter-1)}>{'-'}</Button>
        <input value={counter} maxLength={4} type="number" className="mint-count-text" onChange={(e) => e.target.value < 10000 ? changeCounter(e.target.value) : null} />
        <Button key={3} style={{ width: 25, marginLeft: 2, borderColor: '#0CF3A8', borderWidth: 1, color: '#ffffff', fontSize: 14}} disabled={counter > 100} onClick={() => changeCounter(counter+1)}>{'+'}</Button>
    </ButtonGroup>
    );
}
