import React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import app from 'app';
import ol from 'ol-all';
import mapUtil from 'map-util';

export class Plugin extends app.Component {
    componentDidMount() {
        this.on('wfs.list', () => this.listAction());
        this.on('wfs.identify', xy => this.identifyAction(xy));
    }

    featureInfo(feature) {
        let props = Object.assign({}, feature.getProperties());
        delete props[feature.getGeometryName()];

        return <table><tbody>
            {Object.keys(props).sort().map(k => <tr key={k}>
                    <th>{k}</th>
                    <td>{props[k]}</td>
                </tr>
            )}
        </tbody></table>
    }

    async listAction() {
        let descDoc = await mapUtil.qgis2.request({
            service: 'WFS',
            version: '1.0.0',
            request: 'DescribeFeatureType',
        });

        let types = [];

        for (let typeEl of descDoc.querySelectorAll('complexType')) {
            let name = typeEl.getAttribute('name').replace(/Type$/, ''),
                props = {};
            for (let el of typeEl.querySelectorAll('element')) {
                props[el.getAttribute('name')] = el.getAttribute('type');
            }
            types.push({name, props});
        }

        let gs = await this.emit('selection.getGeometry');
        let geom = gs ? gs[0] : ol.geom.Polygon.fromExtent(app.map().getView().calculateExtent());

        let bbox = ol.proj.transformExtent(
            geom.getExtent(),
            app.config.str('map.crs.client'),
            app.config.str('map.crs.server')
        );

        let featuresDoc = await mapUtil.qgis2.request({
            service: 'WFS',
            version: '1.0.0',
            request: 'GetFeature',
            typename: types.map(t => t.name).join(','),
            bbox: bbox.join(','),
            maxFeatures: 500
        });

        await this.emit('marker.clear');

        let fmt = new ol.format.WFS({
            gmlFormat: new ol.format.GML2()

        });

        for (let feature of fmt.readFeatures(featuresDoc)) {
            this.emit('marker.set', {
                geometry: feature.getGeometry().transform(
                    app.config.str('map.crs.server'),
                    app.config.str('map.crs.client')
                ),
                info: this.featureInfo(feature)
            });
        }
    }
}


export class ListButton extends app.Component {
    onClick() {
        this.emit('wfs.list');
    }

    render() {
        return (
            <IconButton
                onClick={() => this.onClick()}
            >
                <FontIcon className="material-icons">list</FontIcon>
            </IconButton>
        );
    }
}


