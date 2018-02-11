import React from 'react';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';

import app from 'app';
import MaterialIcon from 'components/MaterialIcon';

class Plugin extends app.Plugin {
    init() {

        this.action('dialogShow', (opts) => {
            let dialogParams = {...opts};
            if (opts.content)
                dialogParams.content = <div style={app.theme('gwc.ui.dialog.content')}>{opts.content}</div>;
            if (opts.url)
                dialogParams.content = <iframe frameBorder="0" style={app.theme('gwc.ui.dialog.frame')} src={opts.url}/>;
            app.set({dialogParams})
        });

        this.action('alert', (opts) => {
            let dialogParams = {...opts},
                style = app.theme('gwc.ui.dialog.alert');

            dialogParams.width = opts.width || style.width;
            dialogParams.height = opts.height || style.height;
            dialogParams.content = <div style={{display: 'flex', width: '100%'}}>
                <MaterialIcon color={style.color} icon='error'/>
                <div style={{flex: 1, paddingLeft: 8}}>
                    {opts.content}
                </div>
            </div>;
            app.set({dialogParams});
        });

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
                    {dp.content}
                </Paper>
            </div>
        )
    }
}

export default {
    Plugin,
    Dialog: app.connect(Dialog, ['appIsMobile', 'dialogParams'])
}


