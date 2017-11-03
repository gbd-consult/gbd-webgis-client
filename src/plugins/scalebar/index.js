import React from 'react';
import Slider from 'material-ui/Slider';
import StatusbarTextField from '../ui/components/statusbarTextField'

import app from 'app';
import ol from 'ol-all';

class Plugin extends app.Plugin {
}

class Control extends React.Component {

    render() {
        let slist = app.config.object('map.scales'),
            scale = this.props.mapScale;

        if(!slist || !scale)
            return null;

        let nearest = 0;
        slist.forEach((s, n) => {
            if(Math.abs(s - scale) < Math.abs(slist[nearest] - scale))
                nearest = n
        });

        return (
            <div>
                <StatusbarTextField
                    label='Maßstab'
                    value={'1:' + this.props.mapScale}
                    width={80}
                />
                <Slider
                    style={{width: 200}}
                    min={0}
                    max={slist.length - 1}
                    step={1}
                    value={nearest}
                    onChange={(evt, value) => app.perform('mapSetScale', {scale: slist[value]})}
                />
            </div>
        );
    }
}

export default {
    Plugin,
    Control: app.connect(Control, ['mapScale'])

};

