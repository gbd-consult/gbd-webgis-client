import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import app from 'app';
import ol from 'ol-all';

export class Plugin extends app.Component {

}

export class Control extends app.Component {

    constructor(props) {
        super(props);
        this.state = {
            x: 0,
            y: 0,
            zoom: 0
        }
    }

    componentDidMount() {
        app.map().on('pointermove', (evt) => this.update(evt.pixel));
    }

    componentWillUnmount() {
        super.componentWillUnmount();

    }


    update(pixel) {
        let xy = app.map().getCoordinateFromPixel(pixel);
        this.setState({
            x: xy[0],
            y: xy[1],
            zoom: app.map().getView().getZoom()

        })
    }

    render() {
        return (
            <Paper>
                <TextField value={this.state.x.toFixed(2)}/>
                <TextField value={this.state.y.toFixed(2)}/>
                <TextField value={this.state.zoom}/>
            </Paper>
        );
    }
}

