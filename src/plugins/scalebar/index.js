import React from 'react';

import app from 'app';
import * as sb from 'components/StatusbarWidgets';

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
            <sb.Group>
                <sb.Label
                    value='1:' />
                <sb.Input
                    width={60}
                    onChange={() => 0}
                    value={scales[level]} />

                <sb.SmallSlider
                    min={0}
                    max={len}
                    step={1}
                    value={len - level}
                    onChange={(evt, value) => app.perform('mapSetScaleLevel', {level: len - value})}
                />
            </sb.Group>
        );
    }
}

export default {
    Plugin,
    Control: app.connect(Control, ['mapScaleLevel'])

};

