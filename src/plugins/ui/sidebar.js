import React from 'react';
import VerticalDrawer from './components/VerticalDrawer';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
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
        this.action('navbarVisible', (visible) =>
            app.set({
                navbarVisible: visible,
            })
        );
    }

}

class Switch extends React.Component {
    render() {
        var activeStyle = {
            color : this.props.muiTheme.palette.primary1Color,
        };
        return (
            <Drawer
                docked={false}
                open={this.props.open}
                width={300}
                containerStyle={{ zIndex : 2100 }}
                overlayStyle={{ zIndex : 2000 }}
                onRequestChange={(open) => app.perform('navbarVisible', open)}
            >
                {React.Children.map(this.props.children, child => {
                    let panel = child.key,
                        title = child.props.title;
                    return (
                        <MenuItem
                            style={panel === this.props.active ? activeStyle : null}
                            onClick={() => {
                                app.perform('sidebarShow', {panel});
                                app.perform('navbarVisible', false);
                            }}
                        >
                            {title}
                        </MenuItem>
                    );
                })}
            </Drawer>
        );
    }
}

class Content extends React.Component {
    render() {
        return (
            <VerticalDrawer
                width={this.props.width == SMALL ? '100%' : 450}
                open={this.props.open}
                containerStyle={{paddingTop : this.props.muiTheme.toolbar.height}}
            >
                {
                    React.Children.map(this.props.children, elem => {
                        if (elem.key === this.props.active)
                            return elem;
                        return null;
                    })
                }
            </VerticalDrawer>
        )
    }

}


class Sidebar extends React.Component {
    render() {
        return (
            <div>
                <Switch
                    open={this.props.navbarVisible}
                    active={this.props.sidebarActivePanel}
                    muiTheme={this.props.muiTheme}
                >
                    {this.props.children}
                </Switch>
                <Content
                    width={this.props.width}
                    open={this.props.sidebarVisible}
                    active={this.props.sidebarActivePanel}
                    muiTheme={this.props.muiTheme}
                >
                    {this.props.children}
                </Content>
            </div>
        )
    }
}

export default {
    Plugin,
    Sidebar: app.connect(muiThemeable()(withWidth()(Sidebar)),
                ['sidebarVisible', 'navbarVisible', 'sidebarActivePanel', 'appWaiting']),
}
