import * as React from 'react';
import * as md from 'react-md';
import * as app from 'app';


export class Toolbar extends app.Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}
