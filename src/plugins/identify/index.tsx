import * as React from 'react';
import * as md from 'react-md';
import * as app from 'app';
import * as ol from 'openlayers';
import axios from 'axios';

async function slow(n) {
    return new Promise(res => setTimeout(res, n))
}


export class Plugin extends app.Component {
    componentDidMount() {
        this.on('identify.coordinate', xy => this.showInfo(xy));
    }

    formatInfo(info: any) {
        return <pre>{JSON.stringify(info, null, 4)}</pre>;
    }

    async showInfo(xy: ol.Coordinate) {
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
            app.config.str('map.proj.server'),
            app.config.str('map.proj.client')
        );
        this.emit('marker.show.geometry', geom);
    }
}


export class Button extends app.Component {
    pointer: ol.interaction.Pointer;


    onButtonClick() {
        this.pointer = new ol.interaction.Pointer({
            handleDownEvent: evt => this.onMapDown(evt)
        });
        app.map.get().addInteraction(this.pointer);
    }

    onMapDown(evt: ol.MapBrowserPointerEvent) {
        let xy = ol.proj.transform(evt.coordinate,
            app.config.str('map.proj.client'),
            app.config.str('map.proj.server')
        );
        this.emit('identify.coordinate', xy);
        app.map.get().removeInteraction(this.pointer);
        return false;
    }


    render() {
        return (
            <md.Button
                primary
                floating
                onClick={() => this.onButtonClick()}
                icon
                className="map-control-btn"
                children="info"
            />
        );
    }
}

