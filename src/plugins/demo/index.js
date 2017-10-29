/// demo plugin

import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import ol from 'ol-all';
import app from 'app';

class Plugin extends app.Plugin {

    init() {

        app.set({dotsCount: 0});

        this.action('createDots', ({where}) => {
            let numDots = 1 + Math.floor(Math.random() * 10);
            this.doCreateDots(where, numDots);
            app.perform('incDotCount', {numDots});
        });

        this.reducer('incDotCount', (state, {numDots}) => ({
            dotsCount: state.dotsCount + numDots
        }));

        app.map().on('click', evt => {
            if (evt.originalEvent.shiftKey)
                app.perform('createDots', {
                    where: evt.coordinate
                });
        });
    }

    doCreateDots(where, numDots) {
        let layer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'blue'
                })
            })
        });

        let [x, y] = where;

        while (numDots--) {
            layer.getSource().addFeature(new ol.Feature(
                new ol.geom.Circle([x += 80, y += 80], 50)
            ));
        }

        app.map().addLayer(layer);
    }
}


class Button extends React.Component {

    onClick() {
        app.perform('createDots', {
            where: app.map().getView().getCenter()
        });
    }

    render() {
        return <RaisedButton
            label="Make some dots"
            onClick={() => this.onClick()}
        />
    }
}

class Informer extends React.Component {
    render() {
        return <h3>Total dots = {this.props.dotsCount}</h3>;
    }
}

export default {
    Plugin,
    Button: app.connect(Button),
    Informer: app.connect(Informer, ['dotsCount'])
};
