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
import htmlToReact from 'html-to-react';

import app from 'app';
import ol from 'ol-all';

import * as toolbar from 'components/Toolbar';

const HOVER_DELAY = 100;

class Plugin extends app.Plugin {

    init() {

        this.action('identifyModeToggle', (opts) => {
            let modeName = 'identify' + (opts.hover ? 'Hover' : '');

            if (app.get('mapMode') === modeName) {
                this.reset();
                app.perform('mapDefaultMode');
                return;
            }

            app.perform('mapSetMode', {
                name: modeName,
                cursor: 'help',
                interactions: [
                    this.interaction(opts),
                    'DragPan',
                    'MouseWheelZoom',
                    'PinchZoom',
                ],
                onLeave: () => this.reset()
            });
        });


        this.action('identifyCoordinate', (opts) => {
            let features = [];

            app.perform('search', {
                coordinate: opts.coordinate,
                done: found => {
                    if (!opts.topOnly)
                        features = [].concat(features, found);
                    else if (found.length)
                        features = [found[0]];
                    this.update(features, opts);
                }
            });
        });

    }

    interaction(opts) {
        let run = evt => app.perform('identifyCoordinate', {
            coordinate: evt.coordinate,
            ...opts
        });
        let dragged = false;

        let onDown = evt => {
            dragged = false;
            return true;
        };

        let onUp = evt => dragged ? '' : run(evt);
        let onDrag = evt => dragged = true;
        let onMove = evt => (opts.hover || evt.originalEvent.shiftKey) ? run(evt) : '';

        return new ol.interaction.Pointer({
            handleDownEvent: onDown,
            handleUpEvent: onUp,
            handleDragEvent: onDrag,
            handleMoveEvent: _.debounce(onMove, HOVER_DELAY)
        });
    }

    update(features, opts) {
        if (!features.length)
            return this.reset();

        features.forEach(f => f.set('_popupContent', this.popupContent(f)));

        app.perform('markerMark', {
            features,
            pan: (opts.popup && !opts.hover) ? [0, 100] : false,
            popup: opts.popup ? features.map(f => f.get('_popupContent')) : null,
            animate: true
        });

        if (!opts.popup)
            app.perform('detailsShowFeatures', {features});
    }

    reset() {
        app.perform('markerClear');
        app.perform('detailsShow', {content: null});
    }

    popupContent(feature) {
        let maptip = feature.get('maptip');
        if (maptip)
            return new htmlToReact.Parser().parse(maptip);
        return (
            <div>
                <b>{feature.get('_layerTitle')}</b>: {feature.getId()}
            </div>
        );
    }
}


class Button extends React.Component {

    render() {
        let modeName = 'identify' + (this.props.hover ? 'Hover' : '');

        return (
            <toolbar.Button
                {...this.props}
                active={this.props.mapMode === modeName}
                tooltip={
                    this.props.hover
                        ? __("gwc.plugin.identify.buttonHoverTooltip")
                        : __("gwc.plugin.identify.buttonTooltip")
                }
                onClick={() => app.perform('identifyModeToggle', {
                    hover: this.props.hover,
                    topOnly: this.props.topOnly,
                    popup: this.props.popup
                })}
                icon={this.props.icon}
            />
        );
    }
}

export default {
    Plugin,
    /** Toolbar button that activates the mode */
    Button: app.connect(Button, ['mapMode']),
};
