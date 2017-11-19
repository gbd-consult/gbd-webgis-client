/**
 * @module plugins/selection
 *
 * @desc
 *
 * A tool for selecting areas and objects on the map.
 *
 */
import React from 'react';

import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import ToolbarButton from 'components/ToolbarButton';
import app from 'app';
import mapUtil from 'map-util';
import ol from 'ol-all';


export class Plugin extends app.Plugin {
    init() {
        this.source = null;
        this.style = mapUtil.makeStyle({
            fill: {
                color: 'rgba(255,255,255,0.2)'
            },
            stroke: {
                color: '#000000',
                lineDash: [5, 5],
                width: 1
            }
        });

        this.action('selectionStart', ({shape}) => this.start(shape));
        this.action('selectionDrop', () => this.drop());

        this.action('selectionQuery', () => {
            let features = [];

            app.perform('markerClear');
            app.perform('search', {
                geometry: this.getGeometry(),
                done: found => {
                    features = [].concat(features, found);
                    app.perform('markerMark', {features});
                    app.perform('detailsShowFeatures', {features});
                }
            });
        });
    }

    drawInteraction(shape) {
        if (shape === 'Polygon' || shape === 'Circle') {
            return new ol.interaction.Draw({
                type: shape,
                style: this.style,
                source: this.source
            });
        }
        if (shape === 'Box') {
            return new ol.interaction.Draw({
                type: 'Circle',
                geometryFunction: ol.interaction.Draw.createBox(),
                style: this.style,
                source: this.source
            });
        }
    }

    start(shape) {
        this.source = new ol.source.Vector({
            projection: app.config.str('map.crs.client')
        });
        app.map().removeServiceLayer('selection');
        app.map().serviceLayer('selection', () => new ol.layer.Vector({
            source: this.source,
            style: this.style
        }));

        let draw = this.drawInteraction(shape);
        draw.on('drawend', (evt) => this.end(evt));

        app.perform('mapSetMode', {
            name: 'selection',
            cursor: 'crosshair',
            interactions: [
                draw,
                new ol.interaction.DragPan(),
                new ol.interaction.MouseWheelZoom()
            ]
        });
    }

    end(evt) {
        app.perform('mapDefaultMode');
        app.set({selectionGeometry: evt.feature ? evt.feature.getGeometry() : null})
    }


    drop() {
        app.map().removeServiceLayer('selection');
        this.source = null;
        app.set({selectionGeometry: null});
    }

    getGeometry() {
        if (!this.source)
            return null;

        let fs = this.source.getFeatures();
        if (!fs.length)
            return null;
        return fs[0].getGeometry();
    }
}

class AreaButton extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };
    }

    close() {
        this.setState({
            open: false,
        });
    }

    onClick(evt) {
        evt.preventDefault();
        this.setState({
            open: true,
            anchorEl: evt.currentTarget,
        });
    }

    onClose() {
        this.close();
    }

    onChange(evt, value) {
        if (value === 'deselect')
            app.perform('selectionDrop');
        else
            app.perform('selectionStart', {shape: value});
        this.close();
    }

    render() {
        let active = this.props.mapMode === 'selection';
        return (
            <div>
                <ToolbarButton
                    {...this.props}
                    active={active}
                    onClick={evt => this.onClick(evt)}
                    icon='select_all'
                />
                <Popover
                    open={this.state.open}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={evt => this.onClose(evt)}
                >
                    <Menu onChange={(evt, value) => this.onChange(evt, value)}>
                        <MenuItem value="Box" primaryText="Box"/>
                        <MenuItem value="Polygon" primaryText="Polygon"/>
                        <MenuItem value="Circle" primaryText="Circle"/>
                        <Divider/>
                        <MenuItem value="deselect" primaryText="Deselect"/>
                    </Menu>
                </Popover>
            </div>
        );
    }

}

class QueryButton extends React.Component {

    render() {
        return (
            <div>
                <ToolbarButton
                    {...this.props}
                    tooltip={__("queryTooltip")}
                    onClick={() => app.perform('selectionQuery')}
                    icon='search'
                />
            </div>

        );
    }
}


export default {
    Plugin,

    /** Toolbar button to select areas */
    AreaButton: app.connect(AreaButton, ['mapMode']),

    /** Toolbar button to query selection */
    QueryButton: app.connect(QueryButton),

};
