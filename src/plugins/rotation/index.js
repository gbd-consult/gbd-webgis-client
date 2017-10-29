import React from 'react';
import Slider from 'material-ui/Slider';

import app from 'app';
import ol from 'ol-all';

let rad2deg = a => Math.floor(a / (Math.PI / 180));
let deg2rad = a => a * (Math.PI / 180);

class Plugin extends app.Plugin {
}

class Control extends React.Component {

    render() {
        let deg = rad2deg(this.props.mapRotation || 0);

        return (
            <div style={{border: '2px solid blue'}}>
                <b>{deg}&deg;</b>
                <Slider
                    style={{width: 200}}
                    min={0}
                    max={360}
                    step={1}
                    value={deg}
                    onChange={(evt, value) => app.perform('mapSetRotation', {angle: deg2rad(value)})}
                />
            </div>
        );
    }
}

export default {
    Plugin,
    Control: app.connect(Control, ['mapRotation'])

};

