import React from 'react';
import StatusbarTextField from '../ui/components/StatusbarTextField'
import StatusbarSlider from '../ui/components/StatusbarSlider'

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
            <div>
                <StatusbarTextField
                    label='Maßstab'
                    value={'1:' + scales[level]}
                    width={60}
                />
                <StatusbarSlider
                    width={200}
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

