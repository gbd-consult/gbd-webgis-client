import React from 'react';
import * as md from 'react-md';

import ox from 'ox';
import app from 'app';

export class Plugin extends app.Component {}


export class Button extends app.Component {

    click() {
        this.emit('marker.show.coordinate', ox.proj.fromLonLat([9.9867157, 53.5414746]))
        this.emit('infopanel.update', <div>hello</div>);

    }

    render() {
        return (
            <md.Button
                primary
                onClick={() => this.click()}
                icon
            >add</md.Button>
        );
    }
}
