import React from 'react';

import app from 'app';
import ol from 'ol-all';

import * as sb from 'components/StatusbarWidgets';

let rad2deg = a => Math.floor(a / (Math.PI / 180));
let deg2rad = a => a * (Math.PI / 180);

class Plugin extends app.Plugin {
}

class Control extends React.Component {

    prepare(value) {
        value = Math.floor(Number(value) || 0);
        if(value < -180)
            return -180;
        if(value > 180)
            return 180;
        return value;
    }

    update(value) {
        let deg = rad2deg(this.props.mapRotation || 0),
            val = this.prepare(value);
        if(val === deg)
            this.forceUpdate();
        else
            app.perform('mapSetRotation', {angle: deg2rad(val)});
    }

    render() {
        let deg = rad2deg(this.props.mapRotation || 0);

        return (
            <sb.Group>
                <sb.Input
                    width={40}
                    value={deg}
                    onChange={(evt, value) => this.update(value)}
                    changeOnEnter
                    step={1}
                />
                <sb.Label
                    value='&deg;'/>

                <sb.SmallSlider
                    min={-180}
                    max={180}
                    step={1}
                    value={deg}
                    onChange={(evt, value) => this.update(value)}
                />
            </sb.Group>
        );
    }
}

export default {
    Plugin,
    Control: app.connect(Control, ['mapRotation'])

};

