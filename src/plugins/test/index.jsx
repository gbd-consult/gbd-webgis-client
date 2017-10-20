import React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import ol from 'ol-all';
import app from 'app';

export class Plugin extends app.Component {}


export class Button extends app.Component {

    click() {
        let coord = ol.proj.fromLonLat(
            app.config.object('map.center'),
            app.config.str('map.proj.client'));

        this.emit('marker.show.coordinate', coord);
        this.emit('infopanel.update', <div>hello</div>);

    }

    render() {
        return (
            <IconButton
                onClick={() => this.click()}
            >
                <FontIcon className="material-icons">home</FontIcon>
            </IconButton>
        );
    }
}
