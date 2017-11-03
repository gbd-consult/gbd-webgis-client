/**
 * @module plugins/identify
 *
 * @desc
 *
 * Provides the identification (point+click) map mode
 *
 */


import React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500} from 'material-ui/styles/colors';

import _ from 'lodash';

import app from 'app';
import ol from 'ol-all';

class Plugin extends app.Plugin {

    init() {

        this.uid = 0;
        this.features = [];

        let run = evt => app.perform('identifyCoordinate', {coordinate: evt.coordinate});

        this.action('identifyModeToggle', () => {
            if (app.get('mapMode') === 'identify')
                return app.perform('mapDefaultMode');

            app.perform('mapMode', {
                name: 'identify',
                cursor: 'help',
                interactions: [
                    new ol.interaction.Pointer({
                        handleDownEvent: run,
                        handleMoveEvent: _.debounce(evt => (evt.originalEvent.shiftKey) ? run(evt) : '', 500)
                    }),
                    new ol.interaction.DragPan(),
                    new ol.interaction.MouseWheelZoom()
                ]
            });
        });

        this.action('identifyCoordinate', ({coordinate}) => {
            this.features = [];
            app.perform('markerClear');
            app.perform('identify', {uid: ++this.uid, coordinate});
        });

        this.action('identifyReturn', ({uid, features}) => {
            if (uid !== this.uid) {
                return;
            }
            this.features = [].concat(features, this.features);
            this.update();
        });
    }

    update() {
        app.perform('markerMark', {
            features: this.features,
            pan: false
        });

        app.perform('detailsShowFeatures', {features: this.features});
    }
}


class Button extends React.Component {

    render() {
        let active = this.props.mapMode === 'identify';
        return (
            <IconButton
                tooltip={__("buttonTooltip")}
                onClick={() => app.perform('identifyModeToggle')}
            >
                <FontIcon className="material-icons"
                          color={active ? red500 : blue500}

                >my_location</FontIcon>
            </IconButton>
        );
    }
}


export default {
    Plugin,
    /** Toolbar button that activates the mode */
    Button: app.connect(Button, ['mapMode'])
};
