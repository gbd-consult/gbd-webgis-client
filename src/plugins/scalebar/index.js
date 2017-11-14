import React from 'react';
import Slider from 'material-ui/Slider';

import app from 'app';
import ol from 'ol-all';

class Plugin extends app.Plugin {
}

class Control extends React.Component {

    render() {
        let scales = app.map().getScales(),
            level = this.props.mapScaleLevel;

        if (!scales || isNaN(level))
            return null;

        let len = scales.length - 1;

        return (
            <div style={{border: '2px solid blue'}}>
                <b>1:{scales[level]}</b>
                <Slider
                    style={{width: 200}}
                    min={0}
                    max={len}
                    step={1}
                    value={len - level}
                    onChange={(evt, value) => app.perform('mapSetScaleLevel', {level: len - value})}
                />
            </div>
        );
    }
}

export default {
    Plugin,
    Control: app.connect(Control, ['mapScaleLevel'])

};

