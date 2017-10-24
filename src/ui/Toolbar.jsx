import React from 'react';
import app from 'app';

export default class Toolbar extends React.Component {
    render(){
        var style = {
            position: 'absolute',
            bottom: '10px',
            right: '10px',
        };
        var childStyle = { margin: '5px' };
        return (
            <div style={style}>
                {React.Children.map(this.props.children, child => {
                    return React.cloneElement(child, {
                        style: childStyle
                    })
                })}
            </div>
        );
    }
}

