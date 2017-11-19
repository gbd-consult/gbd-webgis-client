import React from 'react';

import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import {SMALL, MEDIUM, LARGE} from 'material-ui/utils/withWidth';

import app from 'app';
import MaterialIcon from 'components/MaterialIcon';

import zindex from './zindex';

class Plugin extends app.Plugin {
    init() {

        this.action('sidebarShow', ({panel}) =>
            app.set({
                sidebarVisible: true,
                sidebarActivePanel: panel
            })
        );
        this.action('sidebarToggle', () =>
            app.set({
                sidebarVisible: !app.get('sidebarVisible'),
            })
        );
    }
}

class HeaderButton extends React.Component {
    style() {
        let th = app.theme().gbd.ui.sidebar.header;

        let s = {
            padding: 0,
            marginTop: 8,
            marginRight: 16,
            borderRadius: '50%',
            width: 36,
            height: 36,
        };

        if (this.props.active) {
            s.backgroundColor = th.activeBackground;
            s.color = th.activeColor;
        }

        return s;
    }

    render() {
        return (
            <IconButton
                tooltip={this.props.tooltip}
                style={this.style()}
                onClick={this.props.onClick}
            >
                <MaterialIcon
                    color={app.theme().palette.secondaryTextColor}
                    icon={this.props.icon}/>
            </IconButton>
        );
    }
}

class Header extends React.Component {
    style() {
        let th = app.theme().gbd.ui.sidebar.header;

        return {
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            paddingLeft: 8,
            display: 'flex',
            height: app.theme().toolbar.height,
            background: th.background,
            color: th.color
        }
    }

    render() {
        return (
            <div style={this.style()}>
                <HeaderButton
                    onClick={() => app.perform('sidebarToggle')}
                    icon="close"/>

                {
                    React.Children.map(this.props.children, c =>
                        <HeaderButton
                            onClick={() => app.perform('sidebarShow', {panel: c.key})}
                            active={c.key === this.props.sidebarActivePanel}
                            tooltip={c.props.title}
                            icon={c.props.icon}/>
                    )
                }
            </div>
        );
    }
}

class Body extends React.Component {
    style() {
        return {
            position: 'absolute',
            left: 0,
            right: 0,
            top: app.theme().toolbar.height,
            bottom:
                this.props.appIsMobile ? 0 : app.theme().gbd.ui.statusbar.height,
            overflow: 'auto',
        };
    }

    render() {
        return (
            <div style={this.style()}>
                {
                    React.Children.map(this.props.children, c =>
                        (c.key === this.props.sidebarActivePanel) ? c : null
                    )
                }
            </div>
        );
    }
}

class OpenButton extends React.Component {
    style() {
        let th = app.theme().gbd.ui.sidebar.header;

        return {
            padding: 0,
            position: 'absolute',
            left: 8,
            top: 8,
            borderRadius: 0,
            width: 36,
            height: 36,
            background: th.background,
            color: th.color
        }
    }

    render() {
        return (
            <IconButton
                style={this.style()}
                onClick={() => app.perform('sidebarToggle')}
            >
                <MaterialIcon icon='menu' color={app.theme().palette.secondaryTextColor}/>
            </IconButton>

        )
    }
}

class Sidebar extends React.Component {
    width() {
        switch (this.props.appWidth) {
            case SMALL:
                return '100%';
            case MEDIUM:
                return app.theme().gbd.ui.sidebar.mediumWidth;
            case LARGE:
            default:
                return app.theme().gbd.ui.sidebar.largeWidth;
        }
    }

    css() {
        let w = this.width();
        let style = {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: w,
            backgroundColor: 'white',
            transition: 'transform 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
            boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 10px',
            tranform: 'translate(0, 0)',
            zIndex: zindex.sidebar
        }

        if (!this.props.sidebarVisible) {
            if (typeof w === 'number')
                w += 'px';
            style.transform = `translate(-${w},0)`
        }

        return {style};

    }

    render() {
        return (
            <div>
                <OpenButton/>
                <Paper {...this.css()}>
                    <Header {...this.props} />
                    <Body {...this.props} />
                </Paper>
            </div>
        )
    }
}

export default {
    Plugin,
    Sidebar: app.connect(Sidebar,
        ['appWidth', 'appIsMobile', 'sidebarVisible', 'sidebarActivePanel'])
}
