import React from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';


class StatusbarTextField extends React.Component {
    render(){
        let style = {
            height: 'auto',
            marginLeft: 3,
            marginRight: 3,
            display: 'inline-flex',
            cursor: 'default',
        };
        let inputStyle = {
            textAlign: 'right',
            width: this.props.width,
            color: this.props.muiTheme.palette.textColor,
            backgroundColor: 'transparent',
            padding: 0,
            border: 'none',
        };
        let labelStyle = {
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
