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

import ToolbarButton from '../ui/components/ToolbarButton';

import _ from 'lodash';

import app from 'app';
import ol from 'ol-all';
import mapUtil from 'map-util';

class Plugin extends app.Plugin {
    init() {
        this.action('zoom', ({delta}) => {

            let scales = app.config.object('map.scales'),
                currScale = app.map().getScale() + 0.5 * Math.sign(delta),
                newScale;

            if (delta > 0)
                newScale = _.find(scales, s => s > currScale);
            if (delta < 0)
                newScale = _.findLast(scales, s => s < currScale);

            if (newScale) {
                let view = app.map().getView();
                if (view.getAnimating()) {
                    view.cancelAnimations();
                }
                view.animate({
                    resolution: mapUtil.scaleToResolution(newScale),
                    duration: 500,
                    easing: ol.easing.easeOut
                });
            }
        });


        this.action('zoomBoxStart', () => this.start());
    }

    start() {
        // do not enter new mapMode here,
        // just temporarily disable current interactions

        this.activeInteractions = [];
        app.map().getInteractions().forEach(int => {
            if(int.getActive()) {
                int.setActive(false)
                this.activeInteractions.push(int);
            }
        });

        this.boxStartCoordinate = null;

        let boxInt = new ol.interaction.DragBox();

        boxInt.on('boxstart', evt => {
            this.boxStartCoordinate = evt.coordinate;
        });

        boxInt.on('boxend', evt => {
            if(this.boxStartCoordinate)
                this.zoomExtent(this.boxStartCoordinate, evt.coordinate);
            app.map().removeInteraction(boxInt);
            this.activeInteractions.forEach(int => int.setActive(true));
        });

        app.map().addInteraction(boxInt);
    }

    zoomExtent(a, b) {
        let extent = ol.extent.boundingExtent([a, b]);
        app.map().getView().fit(extent);
    }
}


class PlusButton extends React.Component {

    render() {
        return (
            <ToolbarButton
                {...this.props}
                primary
                tooltip={__("plusTooltip")}
                onClick={() => app.perform('zoom', {delta: -1})}
                icon='add'
            />
        );

    }
}

class MinusButton extends React.Component {

    render() {
        return (
            <ToolbarButton
                {...this.props}
                primary
                tooltip={__("minusTooltip")}
                onClick={() => app.perform('zoom', {delta: +1})}
                icon='remove'
            />
        );

    }
}

class BoxButton extends React.Component {

    render() {
        return (
            <ToolbarButton
                {...this.props}
                primary
                tooltip={__("boxTooltip")}
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
    BoxButton: app.connect(BoxButton)

};

