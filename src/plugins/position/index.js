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
        return (
            <div>
                <StatusbarTextField
                    value={xy[0].toFixed(0)}
                    label='X'
                    width={70}
                />
                <StatusbarTextField
                    value={xy[1].toFixed(0)}
                    label='Y'
                    width={70}
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
