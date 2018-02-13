import React from 'react';

import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import {SMALL, MEDIUM, LARGE} from 'material-ui/utils/withWidth';

import app from 'app';
import MaterialIcon from 'components/MaterialIcon';

import helpers from './helpers';

class Plugin extends app.Plugin {
    init() {
        this.action('sidebarShowPanel', ({panel}) =>
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

        this.action('sidebarHide', () =>
            app.set({sidebarVisible: false}));

        this.action('sidebarBlur', () => {
            if (app.get('appIsMobile'))
                app.set({sidebarVisible: false})
        });

        this.action('sidebarShow', () =>
            app.set({sidebarVisible: true}));

    }
}

class Button extends React.Component {
    render() {
        return (
            <IconButton
                tooltip={this.props.tooltip}
                style={this.props.style}
                onClick={this.props.onClick}
            >
                <MaterialIcon
                    color={this.props.style.color}
                    icon={this.props.icon}/>
            </IconButton>
        );
    }
}

class OpenButton extends React.Component {
    render() {
        return <Button
            style={app.theme('gwc.ui.sidebar.openButton')}
            onClick={() => app.perform('sidebarToggle')}
            icon='menu'
        />;
    }
}

class CloseButton extends React.Component {
    render() {
        return <Button
            style={app.theme('gwc.ui.sidebar.headerButton')}
            onClick={() => app.perform('sidebarToggle')}
            icon='keyboard_arrow_left'
        />;
    }
}

class HeaderButton extends React.Component {
    render() {
        let style = app.theme('gwc.ui.sidebar.headerButton'
            + (this.props.active ? 'Active' : ''));

        return <Button
            {...this.props}
            style={style}
        />;
    }
}

class Header extends React.Component {
    render() {
        let style = app.theme('gwc.ui.sidebar.header'),
            hidden = this.props.appControlHidden || {};

        return (
            <div style={style}>
                <CloseButton/>
                <div style={{flex: 1}}/>
                {
                    React.Children.map(this.props.children, c =>
                        helpers.deviceCheck(this, c) &&
                        !hidden[c.key] &&
                        <HeaderButton
                            onClick={() => app.perform('sidebarShowPanel', {panel: c.key})}
                            active={c.key === this.props.sidebarActivePanel}
                            tooltip={c.props.title}
                            icon={c.props.icon}
                        />
                    )
                }
            </div>
        );
    }
}

class Body extends React.Component {
    render() {
        let style = app.theme('gwc.ui.sidebar.body'
            + (this.props.appIsMobile ? '' : 'Desktop'));

        return (
            <Paper style={style}>
                {React.Children.map(this.props.children, c =>
                    (c.key === this.props.sidebarActivePanel) && c)}
            </Paper>
        );
    }
}

class Sidebar extends React.Component {
    render() {
        let style = app.theme('gwc.ui.sidebar.container'
            + (this.props.appWidth === MEDIUM ? 'Medium' :
                (this.props.appWidth === LARGE ? 'Large' : ''))
            + (this.props.sidebarVisible ? 'Visible' : ''));

        return (
            <div>
                <OpenButton/>
                <Paper style={style}>
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
        ['appWidth', 'appControlHidden', 'appIsMobile', 'sidebarVisible', 'sidebarActivePanel'])
}
