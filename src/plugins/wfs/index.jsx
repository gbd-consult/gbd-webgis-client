import React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500} from 'material-ui/styles/colors';

import axios from 'axios';

import app from 'app';
import ol from 'ol-all';


async function request(params) {
    let res = await axios.get(app.config.str('wfs.server'), {params})
    return ol.xml.parse(res.data);
}

async function describe() {

    let descDoc = await request({
        service: 'WFS',
        version: '1.0.0',
        request: 'DescribeFeatureType',
    });

    let tmap = {};

    for (let typeEl of descDoc.querySelectorAll('complexType')) {
        let name = typeEl.getAttribute('name').replace(/Type$/, ''),
            props = {};
        for (let el of typeEl.querySelectorAll('element')) {
            props[el.getAttribute('name')] = el.getAttribute('type');
        }
        tmap[name] = props;
    }

    return tmap;

}

async function find(geometry, types = null, max = 100) {
    let tmap = await describe();

    let qtypes = Object.keys(tmap);

    if (types)
        qtypes = qtypes.filter(t => types.includes(t));

    let bbox = ol.proj.transformExtent(
        geometry.getExtent(),
        app.config.str('map.crs.client'),
        app.config.str('map.crs.server')
    );

    let featuresDoc = await request({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typename: qtypes.join(','),
        bbox: bbox.join(','),
        maxFeatures: max
    });

    let fmt = new ol.format.WFS({
        gmlFormat: new ol.format.GML2()
    });

    let fs = fmt.readFeatures(featuresDoc);

    fs.forEach(f => {
        f.getGeometry().transform(
            app.config.str('map.crs.server'),
            app.config.str('map.crs.client')
        )
    });

    return fs;
}

function enumLayers(selectedUid) {
    let names = [];

    function _enum(layer, hasSelected) {

        if (!layer.getVisible())
            return;

        hasSelected = !selectedUid || hasSelected || ol.getUid(layer) === selectedUid;

        if (hasSelected && layer.get('name'))
            names.push(layer.get('name'))

        if (layer.getLayers)
            layer.getLayers().forEach(sub => _enum(sub, hasSelected));
    }

    _enum(app.map().getLayerGroup(), false);
    return names;
}


class Plugin extends app.Plugin {

    init() {

        this.action('wfsListObjects', async () => {
            let geom = app.get('selectionGeometry');
            if (!geom)
                geom = ol.geom.Polygon.fromExtent(app.map().getView().calculateExtent());
            await this.showFeatures(geom, true);
        });

        this.action('wfsIdentifyCoordinate', async ({coordinate}) => {
            let geom = new ol.geom.Circle(coordinate, 5);
            await this.showFeatures(geom, false);
        });

        this.action('wfsToggleIdentifyMode', () => {
            if (app.get('mapMode') === 'wfsIdentify')
                return app.perform('mapDefaultMode');

            app.perform('mapMode', {
                name: 'wfsIdentify',
                cursor: 'help',
                interactions: [
                    new ol.interaction.Pointer({
                        handleDownEvent: evt => app.perform('wfsIdentifyCoordinate', {coordinate: evt.coordinate})
                    }),
                    new ol.interaction.DragPan(),
                    new ol.interaction.MouseWheelZoom()
                ]
            });
        });
    }

    featureInfo(feature) {
        let props = Object.assign({}, feature.getProperties());
        delete props[feature.getGeometryName()];

        return <table>
            <tbody>
            {Object.keys(props).sort().map(k => <tr key={k}>
                    <th>{k.slice(0, 10) + '...'}</th>
                    <td>{props[k]}</td>
                </tr>
            )}
            </tbody>
        </table>
    }

    async showFeatures(geom) {
        app.set({infoPanelVisible: true, waiting: true});

        let types = enumLayers(app.get('layerActiveUid'));
        let features = await find(geom, types);

        app.perform('markerMark', {
            geometries: features.map(f => f.getGeometry()),
            pan: true
        });

        app.set({
            infoPanelVisible: true,
            infoPanelContent: <div>{features.map(f => this.featureInfo(f))}</div>,
            waiting: false
        });
    }


}


class ListButton extends React.Component {

    render() {
        return (
            <IconButton
                onClick={() => app.perform('wfsListObjects')}
            >
                <FontIcon className="material-icons">list</FontIcon>
            </IconButton>
        );
    }
}

class IdentifyButton extends React.Component {

    render() {
        let active = this.props.mapMode === 'wfsIdentify';
        return (
            <IconButton
                onClick={() => app.perform('wfsToggleIdentifyMode')}
            >
                <FontIcon className="material-icons"
                          color={active ? red500 : blue500}

                >list</FontIcon>
            </IconButton>
        );
    }
}


export default {
    Plugin,
    ListButton: app.connect(ListButton, ['mapMode']),
    IdentifyButton: app.connect(IdentifyButton, ['mapMode'])

};
