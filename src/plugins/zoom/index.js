/**
 * @module plugins/zoom
 *
 * @desc
 *
 * Provides zoom-plus, zoom-minus and zoom-box buttons
 *
 */

import React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import _ from 'lodash';

import app from 'app';
import ol from 'ol-all';
import mapUtil from 'map-util';

class Plugin extends app.Plugin {
    init() {
        this.action('zoom', ({delta}) => {
            app.map().setScaleLevel(
                app.map().getScaleLevel() + delta
            );
        });
        this.action('zoomBoxStart', () => this.start());
    }

    start() {
        this.boxStartCoordinate = null;

        let boxInt = new ol.interaction.DragBox();

        boxInt.on('boxstart', evt => {
            this.boxStartCoordinate = evt.coordinate;
        });

        boxInt.on('boxend', evt => {
            if (this.boxStartCoordinate)
                this.zoomExtent(this.boxStartCoordinate, evt.coordinate);
            app.perform('mapPopMode');
        });

        app.perform('mapPushMode', {
            name: 'zoomBox',
            cursor: 'zoom-in',
            interactions: [boxInt]
        });
    }

    zoomExtent(a, b) {
        let extent = ol.extent.boundingExtent([a, b]);
        app.map().getView().fit(extent);
    }
}


class PlusButton extends React.Component {

    render() {
        return (
            <IconButton
                tooltip={__("plusTooltip")}
                onClick={() => app.perform('zoom', {delta: +1})}
            >
                <FontIcon className="material-icons">add</FontIcon>
            </IconButton>
        );

    }
}

class MinusButton extends React.Component {

    render() {
        return (
            <IconButton
                tooltip={__("minusTooltip")}
                onClick={() => app.perform('zoom', {delta: -1})}
            >
                <FontIcon className="material-icons">remove</FontIcon>
            </IconButton>
        );

    }
}

class BoxButton extends React.Component {

    render() {
        return (
            <IconButton
                tooltip={__("boxTooltip")}
                onClick={() => app.perform('zoomBoxStart')}
            >
                <FontIcon className="material-icons">zoom_in</FontIcon>
            </IconButton>
        );

    }
}

export default {
    Plugin,
    PlusButton: app.connect(PlusButton),
    MinusButton: app.connect(MinusButton),
    BoxButton: app.connect(BoxButton)

};

