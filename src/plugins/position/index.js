import React from 'react';
import TextField from 'material-ui/TextField';

import app from 'app';
import ol from 'ol-all';

class Plugin extends app.Plugin {
    init() {
        app.map().on('pointermove', (evt) => {
            app.set({mapMouseXY: app.map().getCoordinateFromPixel(evt.pixel)})
        });
    }
}

class Control extends React.Component {

    render() {
        let xy = this.props.mapMouseXY || [0, 0];
        return (
            <div>
                <TextField value={xy[0].toFixed(0)}/>
                <TextField value={xy[1].toFixed(0)}/>
            </div>
        );
    }
}

export default{
    Plugin,
    Control: app.connect(Control, ['mapMouseXY'])

};
