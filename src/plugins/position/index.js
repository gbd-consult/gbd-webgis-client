/**
 * @module plugins/position
 *
 * @desc
 *
 * A control to show and edit the current map position.
 *
 */

import React from 'react';
import StatusbarTextField from '../ui/components/statusbarTextField'

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
        var textFieldStyle = {
            width: 70,
            height: 'auto',
            marginLeft: 3,
            marginRight: 3,
        };
        var inputStyle = {
            textAlign: 'right',
        };
        return (
            <div style={{marginLeft: '5px', marginRight: '5px'}}>
                <StatusbarTextField
                    value={xy[0].toFixed(0)}
                    floatingLabelText='X'
                />
                <StatusbarTextField
                    value={xy[1].toFixed(0)}
                    floatingLabelText='Y'
                />
            </div>
        );
    }
}

export default{
    Plugin,

    /** Control component */
    Control: app.connect(Control, ['mapMouseXY'])

};
