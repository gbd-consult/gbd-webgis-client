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
            <Drawer
                width="30%"
                open={this.props.sidebarVisible}
            >
                <Switch active={this.props.sidebarActivePanel}>{this.props.children}</Switch>
                <Content active={this.props.sidebarActivePanel}>{this.props.children}</Content>
            </Drawer>
        )
    }
}

export default {
    Plugin,
    Sidebar: app.connect(Sidebar, ['sidebarVisible', 'sidebarActivePanel', 'appWaiting']),
}
