import React from 'react';

import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import ToolbarButton from '../ui/components/ToolbarButton';

import app from 'app';
import ol from 'ol-all';

const LAYER_NAME = 'selectionLayer';
const MODE_NAME = 'selectionMode';

export class Plugin extends app.Plugin {
    init() {
        this.source = null;
        this.style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#000000',
                lineDash: [5, 5],
                width: 1
            })
        });

        this.action('selectionStart', ({shape}) => this.start(shape));
        this.action('selectionDrop', () => this.drop());

        this.action('mapMode', ({name, cursor, interactions}) => {
            app.map().setMode(name, cursor, interactions)
            app.set({mapMode: name})
        });

        this.action('mapDefaultMode', () => {
            app.map().defaultMode();
            app.set({mapMode: ''})
        });


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

    interactions(shape) {
        if (shape === 'Polygon' || shape === 'Circle') {

            let draw = new ol.interaction.Draw({
                type: shape,
                style: this.style,
                source: this.source
            });
            draw.on('drawend', (evt) => this.end(evt));
            return [
                draw,
                new ol.interaction.DragPan(),
                new ol.interaction.MouseWheelZoom()
            ];
        }
    }

    start(shape) {
        this.source = new ol.source.Vector({
            projection: app.config.str('map.crs.client')
        });
        this.addLayer();
        app.perform('mapMode', {
            name: 'selection',
            cursor: 'crosshair',
            interactions: this.interactions(shape)
        });
    }

    end(evt) {
        app.perform('mapDefaultMode');
        app.set({selectionGeometry: evt.feature ? evt.feature.getGeometry() : null})
    }


    drop() {
        this.removeLayer();
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

class Button extends React.Component {


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

export default {
    Plugin,
    Button: app.connect(Button, ['mapMode'])
};
