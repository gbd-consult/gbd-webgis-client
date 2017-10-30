import React from 'react';
import Drawer from 'material-ui/Drawer';
import CircularProgress from 'material-ui/CircularProgress';

import app from 'app';

class Plugin extends app.Plugin {
}

class Waiting  extends React.Component {
    render() {
        return <CircularProgress />
    }

}



class Statusbar extends React.Component {
    render() {
        return (
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    background: 'white'
                }}
            >
                {this.props.appWaiting ? <Waiting/> : null}
                {this.props.children}
            </div>
        )
    }
}

export default {
    Plugin,
    Statusbar: app.connect(Statusbar)
}
