import React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import axios from 'axios';

import app from 'app';
import ol from 'ol-all';

async function slow(n) {
    return new Promise(res => setTimeout(res, n))
}


export class Plugin extends app.Component {
    componentDidMount() {
        this.on('identify.coordinate', xy => this.showInfo(xy));
    }

    formatInfo(info) {
        return <pre>{JSON.stringify(info, null, 4)}</pre>;
    }

    async showInfo(xy) {
        this.emit('infopanel.wait');

        let x = await slow(1000);

        let url = app.config.str('server.url');

        let fs = await axios.get(url, {
            params: {
                plugin: 'fs_search',
                cmd: 'find',
                x: xy[0],
                y: xy[1]
            }
        });

        if (!fs.data.length) {
            this.emit('infopanel.update', 'Not found');
            return;
        }

        let info = await axios.get(url, {
            params: {
                plugin: 'fs_details',
                cmd: 'info',
                gml_id: fs.data[0].gml_id
            }
        });

        this.emit('infopanel.update', this.formatInfo(info));

        let geom = new ol.format.WKT().readGeometry(info.data.geometry);
        geom.transform(
            app.config.str('map.crs.server'),
            app.config.str('map.crs.client')
        );
        this.emit('marker.show.geometry', geom);
    }
}


export class Button extends app.Component {


    onButtonClick() {
        this.pointer = new ol.interaction.Pointer({
            handleDownEvent: evt => this.onMapDown(evt)
        });
        app.map().addInteraction(this.pointer);
    }

    onMapDown(evt) {
        let xy = ol.proj.transform(evt.coordinate,
            app.config.str('map.crs.client'),
            app.config.str('map.crs.server')
        );
        this.emit('identify.coordinate', xy);
        app.map().removeInteraction(this.pointer);
        return false;
    }


    render() {
        return (
            <IconButton
                onClick={() => this.onButtonClick()}
            >
                <FontIcon className="material-icons">info</FontIcon>
            </IconButton>
        );
    }
}

