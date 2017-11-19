/**
 * @module plugins/position
 *
 * @desc
 *
 * A control to show and edit the current map position.
 *
 */

import React from 'react';

import app from 'app';
import ol from 'ol-all';

import * as sb from 'components/StatusbarWidgets';


class Plugin extends app.Plugin {
    init() {
        app.set({
            mapMouseXY: app.map().getView().getCenter()
        });

        app.map().on('pointermove', (evt) => {
            app.set({
                mapMouseXY: evt.coordinate
            })
        });
    }
}

class Control extends React.Component {

    render() {
        let xy = this.props.mapMouseXY || [0, 0];
        return (
            <sb.Group>
                <sb.Label
                    value='x' />
                <sb.Input
                    width={70}
                    onChange={() => 0}
                    value={xy[0].toFixed(0)} />
                <sb.Label
                    value='y' />
                <sb.Input
                    width={70}
                    onChange={() => 0}
                    value={xy[1].toFixed(0)} />
            </sb.Group>
        );
    }
}

export default{
    Plugin,

    /** Control component */
    Control: app.connect(Control, ['mapMouseXY'])

};
