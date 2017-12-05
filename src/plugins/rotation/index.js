import React from 'react';

import app from 'app';
import ol from 'ol-all';

import * as sb from 'components/StatusbarWidgets';

let rad2deg = a => Math.floor(a / (Math.PI / 180));
let deg2rad = a => a * (Math.PI / 180);

class Plugin extends app.Plugin {
}

class Control extends React.Component {

    render() {
        let deg = rad2deg(this.props.mapRotation || 0);

        return (
            <sb.Group>
                <sb.Input
                    width={40}
                    onChange={() => 0}
                    value={deg}/>
                <sb.Label
                    value='&deg;'/>

                <sb.SmallSlider
                    min={-180}
                    max={180}
                    step={1}
                    value={deg}
                    onChange={(evt, value) => app.perform('mapSetRotation', {angle: deg2rad(value)})}
                />
            </sb.Group>
        );
    }
}

export default {
    Plugin,
    Control: app.connect(Control, ['mapRotation'])

};

