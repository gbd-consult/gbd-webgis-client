import React from 'react';
import Drawer from 'material-ui/Drawer';
import CircularProgress from 'material-ui/CircularProgress';

import app from 'app';


class InfoPanel extends React.Component {

    render() {
        return (
            <Drawer
                openSecondary
                width="30%"
                open={!!this.props.infoPanelVisible}
            >
                {this.props.waiting ? <CircularProgress /> : this.props.infoPanelContent}
            </Drawer>
        )
    }
}

class Toolbar extends React.Component {
    render() {
        return <div style={{position: 'fixed', left: 400, top: 0}}>{this.props.children}</div>


    }
}


export default {
    InfoPanel: app.connect(InfoPanel, ['infoPanelVisible', 'infoPanelContent', 'waiting']),
    Toolbar: app.connect(Toolbar)
}
