import React from 'react';
import htmlToReact from 'html-to-react';

import app from 'app';

class Plugin extends app.Plugin {
}


class Bar extends React.Component {

    render() {
        let content = new htmlToReact.Parser().parse(app.config.str('attribution'));
        return (
            <div style={app.theme('gwc.plugin.attribution.bar')}>
                {React.Children.map(content, (item, i) =>
                    <span key={i}>
                        {item.type === 'a' ? <Link {...item.props}/> : item}
                    </span>
                )}
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

