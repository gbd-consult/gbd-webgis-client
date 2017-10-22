import React from 'react';
import app from 'app';


export default class Toolbar extends app.Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}
