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

class Switch extends React.Component {
    render() {
        return (
            <div>
                {
                    React.Children.map(this.props.children, elem => {
                        let panel = elem.key,
                            title = elem.props.title;

                        if (panel === this.props.active)
                            return <b>{title}</b>;
                        return (
                            <a
                                onClick={() => app.perform('sidebarShow', {panel})}
                            >
                                {title}
                            </a>
                        )
                    })
                }
            </div>

        )
    }
}

class Content extends React.Component {
    render() {
        return (
            <div style={{border: '1px solid red'}}>
                {
                    React.Children.map(this.props.children, elem => {
                        if (elem.key === this.props.active)
                            return elem;
                        return null;
                    })
                }
            </div>

        )
    }

}


class Sidebar extends React.Component {
    render() {
        return (
            <VerticalDrawer
                width={this.props.width == SMALL ? '100%' : 450}
                open={this.props.sidebarVisible}
                containerStyle={{paddingTop : this.props.muiTheme.toolbar.height}}
            >
                <Switch active={this.props.sidebarActivePanel}>{this.props.children}</Switch>
                <Content active={this.props.sidebarActivePanel}>{this.props.children}</Content>
            </VerticalDrawer>
        )
    }
}

export default {
    Plugin,
    Sidebar: app.connect(muiThemeable()(withWidth()(Sidebar)),
                ['sidebarVisible', 'sidebarActivePanel', 'appWaiting']),
}
