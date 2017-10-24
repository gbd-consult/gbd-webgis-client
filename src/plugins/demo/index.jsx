/// demo plugin

import React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import ol from 'ol-all';
import app from 'app';

export class Plugin extends app.Component {}


export class Button extends app.Component {

    onClick() {
        let point = app.config.object('map.center');
        this.emit('marker.set', {point});
        this.emit('infopanel.update', <div>Chewie we're home!</div>);
        app.map().getView().setCenter(point);
        app.map().getView().setZoom(18);
    }

    render() {
        return (
            <IconButton
                onClick={() => this.onClick()}
            >
                <FontIcon className="material-icons">home</FontIcon>
            </IconButton>
        );
    }
}
