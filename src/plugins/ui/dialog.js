import React from 'react';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';

import app from 'app';
import MaterialIcon from 'components/MaterialIcon';

class Plugin extends app.Plugin {
    init() {

        this.action('dialogShow', (opts) =>
            app.set({
                dialogParams: opts
            })
        );

        this.action('dialogHide', () =>
            app.set({
                dialogParams: null,
            })
        );
    }
}


class CloseButton extends React.Component {
    render() {
        return (
            <IconButton
                tooltip={this.props.tooltip}
                style={app.theme('gwc.ui.dialog.closeButton')}
                onClick={() => app.perform('dialogHide')}
            >
                <MaterialIcon
                    icon='close'/>
            </IconButton>
        );
    }
}


class Dialog extends React.Component {

    render() {
        if (!this.props.dialogParams)
            return null;

        let dp = this.props.dialogParams;
        let boxStyle = app.theme('gwc.ui.dialog.box' + (this.props.appIsMobile ? '' : 'Desktop'));

        if (!this.props.appIsMobile) {

            let w = dp.width || 800;
            let h = dp.height || 600;

            boxStyle.marginLeft = -(w / 2);
            boxStyle.width = w;
            boxStyle.marginTop = -(h / 2);
            boxStyle.height = h;
        }

        return (
            <div style={app.theme('gwc.ui.dialog.shadow')}>
                <Paper zDepth={2} style={boxStyle}>
                    <CloseButton/>
                    <div style={app.theme('gwc.ui.dialog.content')}>
                        {dp.content}
                    </div>
                </Paper>
            </div>
        )
    }
}

export default {
    Plugin,
    Dialog: app.connect(Dialog, ['appIsMobile', 'dialogParams'])
}


