import React from 'react';
import app from 'app';


export class Toolbar extends app.Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}
