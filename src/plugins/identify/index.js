/**
 * @module plugins/identify
 *
 * @desc
 *
 * Provides the identification (point+click) map mode
 *
 */


import React from 'react';
import Paper from 'material-ui/Paper';

import _ from 'lodash';
import htmlToReact from 'html-to-react';

import app from 'app';
import ol from 'ol-all';

import SimpleButton from 'components/SimpleButton';
import * as toolbar from 'components/Toolbar';

const hoverDelay = 100;

class Plugin extends app.Plugin {

    init() {

        this.action('identifyModeToggle', ({hover, topOnly, popup}) => {
            let modeName = 'identify' + (hover ? 'Hover' : '');

            if (app.get('mapMode') === modeName) {
                this.reset();
                app.perform('mapDefaultMode');
                return;
            }

            app.perform('mapSetMode', {
                name: modeName,
                cursor: 'help',
                interactions: [
                    this.interaction(hover, topOnly, popup),
                    'DragPan',
                    'MouseWheelZoom',
                    'PinchZoom',
                ],
                onLeave: () => this.reset()
            });
        });


        this.action('identifyCoordinate', ({coordinate, topOnly, popup}) => {
            let features = [];

            app.perform('search', {
                coordinate,
                done: found => {
                    if (!topOnly)
                        features = [].concat(features, found);
                    else if (found.length)
                        features = [found[0]]
                    this.update(features, popup);
                }
            });
        });

        this.action('identifyPopupShow', ({features}) =>
            app.set({identifyPopupContent: features}));

        this.action('identifyPopupHide', () =>
            app.set({identifyPopupContent: null}));

    }

    interaction(hover, topOnly, popup) {
        let run = evt => app.perform('identifyCoordinate', {
            coordinate: evt.coordinate,
            topOnly,
            popup
        });
        let dragged = false;

        let onDown = evt => {
            dragged = false;
            return true;
        };

        let onUp = evt => dragged ? '' : run(evt);
        let onDrag = evt => dragged = true;
        let onMove = evt => (hover || evt.originalEvent.shiftKey) ? run(evt) : '';

        return new ol.interaction.Pointer({
            handleDownEvent: onDown,
            handleUpEvent: onUp,
            handleDragEvent: onDrag,
            handleMoveEvent: _.debounce(onMove, hoverDelay)
        });
    }

    update(features, popup) {
        if (!features.length)
            return this.reset();

        app.perform('markerMark', {
            features,
            pan: false
        });

        if (popup)
            app.perform('identifyPopupShow', {features});
        else
            app.perform('detailsShowFeatures', {features});
    }

    reset() {
        app.perform('identifyPopupHide');
        app.perform('markerClear');
        app.perform('detailsShow', {content: null});
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
                        ? __("buttonHoverTooltip")
                        : __("buttonTooltip")
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

class Popup extends React.Component {
    content() {
        let feature = this.props.identifyPopupContent[0];

        let maptip = feature.get('maptip');
        if (maptip)
            return (
                <div className="maptip">
                    {new htmlToReact.Parser().parse(maptip)}
                </div>
            );

        return (
            <div>
                <b>{feature.get('_layerTitle')}</b>: {feature.getId()}
            </div>
        );
    }

    render() {
        if (!this.props.identifyPopupContent)
            return null;

        let style = {
            ...app.theme('gwc.plugin.identify.popup')
        };

        if (this.props.sidebarVisible)
            style.left += app.theme('gwc.ui.sidebar.containerLarge.width');

        return (
            <Paper zDepth={2} style={style}>
                <SimpleButton
                    style={app.theme('gwc.plugin.identify.popupCloseButton')}
                    icon='close'
                    onClick={() => app.perform('identifyPopupHide')}
                />
                {this.content()}
            </Paper>
        );
    }
}

export default {
    Plugin,
    /** Toolbar button that activates the mode */
    Button: app.connect(Button, ['mapMode']),
    Popup: app.connect(Popup, ['identifyPopupContent', 'sidebarVisible']),
};
