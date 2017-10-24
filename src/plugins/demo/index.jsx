/// demo plugin

import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';

import ol from 'ol-all';
import app from 'app';

export class Plugin extends app.Component {}


export class Button extends app.Component {

    onClick() {
        let center = app.config.object('map.center');
        this.emit('marker.show.coordinate', center);
        this.emit('infopanel.update', <div>Chewie we're home!</div>);
        app.map().getView().setCenter(center);
        app.map().getView().setZoom(18);
    }

    render() {
        return (
            <FloatingActionButton
                onClick={() => this.onClick()}
                secondary
            >
                <FontIcon className='material-icons'>
                    home
                </FontIcon>
            </FloatingActionButton>
        );
    }
}
