import React from 'react';
import VerticalDrawer from './components/VerticalDrawer';
import CircularProgress from 'material-ui/CircularProgress';

import muiThemeable from 'material-ui/styles/muiThemeable';
import withWidth, {SMALL} from 'material-ui/utils/withWidth';

import app from 'app';

class Plugin extends app.Plugin {
    init() {

        this.action('sidebarShow', ({panel}) =>
            app.set({
                sidebarVisible: true,
                sidebarActivePanel: panel
            })
        );
        this.action('sidebarVisible', (visible) =>
            app.set({
                sidebarVisible: visible,
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
            <VerticalDrawer
                width={this.props.width == SMALL ? '100%' : 450}
                open={this.props.sidebarVisible}
                containerStyle={{paddingTop : this.props.muiTheme.toolbar.height}}
            >
                {this.props.appWaiting ? <Waiting/> : this.content()}
            </VerticalDrawer>
        )
    }
}

export default {
    Plugin,
    Sidebar: app.connect(muiThemeable()(withWidth()(Sidebar)),
                ['sidebarVisible', 'sidebarActivePanel', 'appWaiting']),
}
