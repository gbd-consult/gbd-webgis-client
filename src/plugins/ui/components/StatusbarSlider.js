import React from 'react';
import Slider from 'material-ui/Slider';
import muiThemeable from 'material-ui/styles/muiThemeable';


class StatusbarSlider extends React.Component {
    render(){
        let style = {
            display: 'inline-flex',
        };
        let sliderStyle = {
            width: this.props.width,
            height: this.props.muiTheme.toolbar.height / 4,
            margin: '0px 10px',
        };
        return (
            <Slider
                style={style}
                sliderStyle={sliderStyle}
                min={this.props.min}
                max={this.props.max}
                step={this.props.step}
                value={this.props.value}
                onChange={this.props.onChange}
            />
        );
    }
}

export default muiThemeable()(StatusbarSlider);
