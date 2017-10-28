import React from 'react';
import Drawer from 'material-ui/Drawer';
import CircularProgress from 'material-ui/CircularProgress';

import app from 'app';

class Plugin extends app.Plugin {
    init() {

        this.action('sidebarShow', ({panel}) =>
            app.set({
                sidebarVisible: true,
                sidebarActivePanel: panel
            })
        );


    }

}

class Waiting  extends React.Component {
    render() {
        return <CircularProgress />
    }

}



class Sidebar extends React.Component {
    content() {
        return React.Children.map(this.props.children, panel => {
            let display = panel.key === this.props.sidebarActivePanel ? 'block' : 'none';
            return <div key={panel.key} style={{display}}>{panel}</div>;
        });
    }


    render() {
        return (
            <Drawer
                width="30%"
                open={this.props.sidebarVisible}
            >
                {this.props.appWaiting ? <Waiting/> : this.content()}
            </Drawer>
        )
    }
}

export default {
    Plugin,
    Sidebar: app.connect(Sidebar, ['sidebarVisible', 'sidebarActivePanel', 'appWaiting']),
}
