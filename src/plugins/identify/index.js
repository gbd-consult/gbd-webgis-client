/**
 * @module plugins/identify
 *
 * @desc
 *
 * Provides the identification (point+click) map mode
 *
 */


import React from 'react';
import _ from 'lodash';

import app from 'app';
import ol from 'ol-all';

import * as toolbar from 'components/Toolbar';
import GbdIcon from 'components/GbdIcon';

class Plugin extends app.Plugin {

    init() {

        let run = evt => app.perform('identifyCoordinate', {coordinate: evt.coordinate});

        this.action('identifyModeToggle', () => {
            if (app.get('mapMode') === 'identify')
                return app.perform('mapDefaultMode');

            app.perform('mapSetMode', {
                name: 'identify',
                cursor: 'help',
                interactions: [
                    new ol.interaction.Pointer({
                        handleDownEvent: run,
                        handleMoveEvent: _.debounce(evt => (evt.originalEvent.shiftKey) ? run(evt) : '', 500)
                    }),
                    'DragPan',
                    'MouseWheelZoom',
                    'PinchZoom',
                ]
            });
        });

        this.action('identifyCoordinate', ({coordinate}) => {
            let features = [];

            app.perform('markerClear');
            app.perform('search', {
                coordinate,
                done: found => {
                    features = [].concat(features, found);
                    this.update(features);
                }
            });
        });
    }

    update(features) {
        app.perform('markerMark', {
            features,
            pan: false
        });

        app.perform('detailsShowFeatures', {features});
    }
}


class Button extends React.Component {

    render() {
        return (
            <toolbar.Button
                {...this.props}
                active={this.props.mapMode === 'identify'}
                tooltip={__("buttonTooltip")}
                onClick={() => app.perform('identifyModeToggle')}
            >
                <GbdIcon icon='identify'/>
            </toolbar.Button>
        );
    }
}


export default {
    Plugin,
    /** Toolbar button that activates the mode */
    Button: app.connect(Button, ['mapMode'])
};
