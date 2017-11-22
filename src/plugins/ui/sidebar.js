import React from 'react';

import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import {SMALL, MEDIUM, LARGE} from 'material-ui/utils/withWidth';

import app from 'app';
import MaterialIcon from 'components/MaterialIcon';

import helpers from './helpers';

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

class OpenButton extends React.Component {
    render() {
        return (
            <IconButton
                style={this.props.css.openButton}
                onClick={() => app.perform('sidebarToggle')}
            >
                <MaterialIcon icon='menu' color={this.props.css.openButton.color}/>
            </IconButton>
        )
    }
}

class CloseButton extends React.Component {
    render() {
        return (
            <IconButton
                style={this.props.css.closeButton}
                onClick={() => app.perform('sidebarToggle')}
            >
                <MaterialIcon icon='keyboard_arrow_left' color={this.props.css.openButton.color}/>
            </IconButton>
        )
    }
}

class HeaderButton extends React.Component {
    render() {
        return (
            <IconButton
                tooltip={this.props.tooltip}
                style={this.props.active ? this.props.css.headerButtonActive : this.props.css.headerButton}
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
    render() {
        return (
            <div style={this.props.css.header}>
                <CloseButton css={this.props.css}/>
                <div style={{flex: 1}}/>
                {
                    React.Children.map(this.props.children, c => helpers.deviceCheck(this, c) &&
                        <HeaderButton
                            css={this.props.css}
                            onClick={() => app.perform('sidebarShow', {panel: c.key})}
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
        return (
            <div style={this.props.css.body}>
                {
                    React.Children.map(this.props.children, c =>
                        (c.key === this.props.sidebarActivePanel) ? c : null
                    )
                }
            </div>
        );
    }
}

class Sidebar extends React.Component {
    css() {
        let th = app.theme().gbd.ui.sidebar;
        let gutter = app.theme().gbd.ui.gutter;
        let w;

        switch (this.props.appWidth) {
            case SMALL:
                w = '100%';
                break;
            case MEDIUM:
                w = th.mediumWidth;
                break;
            case LARGE:
            default:
                w = th.largeWidth;
        }

        let container = {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: w,
            backgroundColor: th.background,
            transition: 'transform 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
            boxShadow: th.shadow,
            tranform: 'translate(0, 0)',
            zIndex: helpers.zIndex.sidebar
        };

        if (!this.props.sidebarVisible) {
            if (typeof w === 'number')
                w += 'px';
            container.transform = `translate(-${w},0)`
        }

        let toggle = {
            borderRadius: '0 8px 8px 0',
            width: 38,
            height: th.header.height,

            background: th.toggle.background,
            color: th.toggle.color,

            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: th.toggle.borderColor,
            borderLeftStyle: 'none',
        };

        let openButton = {
            ...toggle,
            padding: 0,
            position: 'absolute',
            left: 0,
            top: gutter,
            boxShadow: th.shadow,
        };

        let closeButton = {
        };

        let body = {
            position: 'absolute',
            left: 0,
            right: 0,
            top: th.header.height + gutter * 2,
            bottom:
                this.props.appIsMobile ? 0 : app.theme().gbd.ui.statusbar.height,
            overflow: 'auto',
        };

        let header = {
            boxSizing: 'border-box',
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            paddingTop: gutter,
            paddingBottom: gutter,
            display: 'flex',
            height: th.header.height + gutter * 2,
            background: th.header.background,
            color: th.header.color
        };

        let headerButton = {
            padding: 0,
            marginTop: 8,
            marginRight: 16,
            borderRadius: '50%',
            width: 36,
            height: 36,
        };

        let headerButtonActive = {
            ...headerButton,
            backgroundColor: th.header.activeBackground,
            color: th.header.activeColor
        };


        return {
            container,
            openButton,
            closeButton,
            body,
            header,
            headerButton,
            headerButtonActive
        }
    }

    render() {
        let css = this.css();
        return (
            <div>
                <OpenButton css={css}/>
                <Paper style={css.container}>
                    <Header css={css} {...this.props} />
                    <Body css={css} {...this.props} />
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
