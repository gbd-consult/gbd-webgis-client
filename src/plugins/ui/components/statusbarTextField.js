import React from 'react';
import TextField from 'material-ui/TextField';
import muiThemeable from 'material-ui/styles/muiThemeable';


class StatusbarTextField extends React.Component {
    render(){
        var style = {
            width: this.props.width,
            height: 'auto',
            marginLeft: 3,
            marginRight: 3,
            display: 'inline-flex',
            cursor: 'default',
        };
        var inputStyle = {
            textAlign: 'right',
            width: this.props.width - 20,
            color: this.props.muiTheme.palette.textColor,
            backgroundColor: 'transparent',
            padding: 0,
            border: 'none',
        };
        var labelStyle = {
            color: this.props.muiTheme.palette.primary1Color,
        };
        return (
            <div style={style}>
                <label style={labelStyle}>{this.props.label}</label>
                <input disabled style={inputStyle} value={this.props.value}/>
            </div>
        );
    }
}

export default muiThemeable()(StatusbarTextField);
