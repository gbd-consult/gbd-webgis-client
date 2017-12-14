/**
 * @module plugins/zoom
 *
 * @desc
 *
 * Provides zoom-plus, zoom-minus and zoom-box buttons
 *
 */

import React from 'react';
import _ from 'lodash';

import app from 'app';
import ol from 'ol-all';

import * as toolbar from 'components/Toolbar';

class Plugin extends app.Plugin {
    init() {
        this.action('zoom', ({delta}) => {
            app.map().setScaleLevel(
                app.map().getScaleLevel() + delta
            );
        });

        this.action('zoomFull', () => {
            let scales = app.map().getScales();
            app.map().setScale(scales[0]);
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
            <toolbar.Button
                {...this.props}
                tooltip={__("gwc.plugin.zoom.plusTooltip")}
                onClick={() => app.perform('zoom', {delta: +1})}
                icon='add_circle_outline'
            />
        );

    }
}

class MinusButton extends React.Component {

    render() {
        return (
            <toolbar.Button
                {...this.props}
                tooltip={__("gwc.plugin.zoom.minusTooltip")}
                onClick={() => app.perform('zoom', {delta: -1})}
                icon='remove_circle_outline'
            />
        );

    }
}

class FullButton extends React.Component {

    render() {
        return (
            <toolbar.Button
                {...this.props}
                tooltip={__("gwc.plugin.zoom.fullTooltip")}
                onClick={() => app.perform('zoomFull')}
                icon='zoom_out_map'
            />
        );

    }
}

class BoxButton extends React.Component {

    render() {
        return (
            <toolbar.Button
                {...this.props}
                tooltip={__("gwc.plugin.zoom.boxTooltip")}
                onClick={() => app.perform('zoomBoxStart')}
                icon='zoom_in'
            />
        );

    }
}

export default {
    Plugin,
    PlusButton: app.connect(PlusButton),
    MinusButton: app.connect(MinusButton),
    BoxButton: app.connect(BoxButton),
    FullButton: app.connect(FullButton),

};

