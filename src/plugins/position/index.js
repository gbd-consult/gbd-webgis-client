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

    format(coord) {
        return coord[0].toFixed(0) + ', ' + coord[1].toFixed(0)
    }

    prepare(value, min, max) {
        value = Math.floor(Number(value) || 0);
        if (value > max)
            return max;
        if (value < min)
            return min;
        return value;
    }

    update(value) {
        let extent = app.map().getBounds(),
            xy = String(value).split(','),
            coord = [
                this.prepare(xy[0], extent[0], extent[2]),
                this.prepare(xy[1], extent[1], extent[3])
            ];

        app.perform('markerMarkPoint', {
            coord,
            pan: true,
            animate: true,
            popup: this.format(coord)
        });
    }

    render() {
        let xy = this.props.mapMouseXY || [0, 0];

        return (
            <sb.Group>
                <sb.Label
                    value='XY'/>
                <sb.Input
                    width={100}
                    onChange={(evt, value) => this.update(value)}
                    changeOnEnter
                    value={this.format(xy)}/>
            </sb.Group>
        );
    }
}

export default {
    Plugin,

    /** Control component */
    Control: app.connect(Control, ['mapMouseXY'])

};
