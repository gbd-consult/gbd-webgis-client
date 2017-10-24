import React from 'react';

import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import {blue500, red500} from 'material-ui/styles/colors';


import app from 'app';
import ol from 'ol-all';

const LAYER_NAME = 'selectionLayer';
const MODE_NAME = 'selectionMode';

export class Plugin extends app.Component {
    constructor(props) {
        super(props);
        this.source = null;
        this.style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#000000',
                lineDash: [5, 5],
                width: 1
            })
        });

    }

    componentDidMount() {
        this.on('selection.start', type => this.start(type));
        this.on('selection.drop', () => this.drop());
        this.on('selection.getGeometry', () => this.getGeometry());
    }

    removeLayer() {
        for (let la of app.map().getLayers().getArray()) {
            if (la.get('name') === LAYER_NAME) {
                app.map().removeLayer(la);
                return;
            }
        }
    }

    addLayer() {
        this.removeLayer();
        let la = new ol.layer.Vector({
            source: this.source,
            style: this.style
        });

        la.set('name', LAYER_NAME);
        app.map().addLayer(la);
        return la;
    }

    interactions(type) {
        if (type === 'polygon' || type === 'circle') {
            type = type[0].toUpperCase() + type.slice(1);

            let draw = new ol.interaction.Draw({
                type: type,
                style: this.style,
                source: this.source
            });
            draw.on('drawend', () => this.end());
            return [
                draw,
                new ol.interaction.DragPan(),
                new ol.interaction.MouseWheelZoom()
            ];
        }
    }

    start(type) {
        this.source = new ol.source.Vector({
            projection: app.config.str('map.crs.client')
        });
        this.addLayer();
        app.map().setMode(MODE_NAME, 'crosshair', this.interactions(type));
    }

    end() {
        app.map().defaultMode();
    }

    drop() {
        this.removeLayer();
        this.source = null;
    }

    getGeometry() {
        if (!this.source)
            return null;

        let fs = this.source.getFeatures();
        if(!fs.length)
            return null;
        return fs[0].getGeometry();
    }
}

export class Button extends app.Component {


    constructor(props) {
        super(props);

        this.state = {
            open: false,
            active: false
        };
    }

    componentDidMount() {
        this.on('map.mode.start', mode => this.setActive(mode === MODE_NAME));
    }

    close() {
        this.setState({
            open: false,
        });
    }

    setActive(on) {
        this.setState({
            active: on,
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
            this.emit('selection.drop');
        else
            this.emit('selection.start', value);
        this.close();
    }

    render() {
        return (
            <div>
                <IconButton
                    onClick={evt => this.onClick(evt)}
                >
                    <FontIcon
                        className="material-icons"
                        color={this.state.active ? red500 : blue500}
                    >select_all</FontIcon>
                </IconButton>
                <Popover
                    open={this.state.open}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={evt => this.onClose(evt)}
                >
                    <Menu onChange={(evt, value) => this.onChange(evt, value)}>
                        <MenuItem value="polygon" primaryText="Polygon"/>
                        <MenuItem value="circle" primaryText="Circle"/>
                        <Divider/>
                        <MenuItem value="deselect" primaryText="Deselect"/>
                    </Menu>
                </Popover>
            </div>
        );
    }

}

