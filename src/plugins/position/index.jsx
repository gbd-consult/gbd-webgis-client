import React from 'react';
import Paper from 'material-ui/Paper';
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
            <Paper>
                <TextField value={xy[0].toFixed(0)}/>
                <TextField value={xy[1].toFixed(0)}/>
            </Paper>
        );
    }
}

export default{
    Plugin,
    Control: app.connect(Control, ['mapMouseXY'])

};
