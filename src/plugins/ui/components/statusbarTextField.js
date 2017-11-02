import React from 'react';
import TextField from 'material-ui/TextField';
import muiThemeable from 'material-ui/styles/muiThemeable';


class StatusbarTextField extends React.Component {
    render(){
        var textFieldStyle = {
            width: 80,
            height: 'auto',
            marginLeft: 3,
            marginRight: 3,
            display: 'inline-flex',
            cursor: 'default',
        };
        var inputStyle = {
            textAlign: 'right',
            lineHeight: '28px',
            marginTop: 0,
            color: this.props.muiTheme.palette.primaryTextColor,
        };
        var floatingLabelStyle = {
            position: 'static',
            transform: 'none',
        };
        return (
            <TextField
                disabled
                value={this.props.value}
                floatingLabelText={this.props.floatingLabelText}
                style={textFieldStyle}
                inputStyle={inputStyle}
                underlineShow={false}
                floatingLabelStyle={floatingLabelStyle}
                floatingLabelFocusStyle={floatingLabelStyle}
                floatingLabelShrinkStyle={floatingLabelStyle}
            />
        );
    }
}

export default muiThemeable()(StatusbarTextField);
