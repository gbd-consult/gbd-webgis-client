import React from 'react';

import app from 'app';

class Plugin extends app.Plugin {
}


class Bar extends React.Component {

    render() {
        return (
            <div style={app.theme('gwc.plugin.attribution.bar')}>
                {this.props.children}
            </div>
        )
    }
}

class Link extends React.Component {

    render() {
        return (
            <a style={app.theme('gwc.plugin.attribution.link')}
               href={this.props.href}
               target='_blank'
            >{this.props.children}</a>
        )
    }
}

export default {
    Plugin,
    Bar: app.connect(Bar),
    Link: app.connect(Link),
};

