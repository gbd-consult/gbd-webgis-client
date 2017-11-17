import React from 'react';
import StatusbarTextField from '../ui/components/StatusbarTextField'
import StatusbarSlider from '../ui/components/StatusbarSlider'

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
            <div>
                <StatusbarTextField
                    label='Rotation'
                    value={deg + '°'}
                    width={40}
                />
                <StatusbarSlider
                    width={80}
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

