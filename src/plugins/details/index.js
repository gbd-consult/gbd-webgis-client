/// provides the details panel in the side bar

import React from 'react';
import Paper from 'material-ui/Paper';

import app from 'app';

import FeatureList from './FeatureList';

class Plugin extends app.Plugin {
    init() {
        app.update('sidebarVisiblePanel', {details: true})

        this.action('detailsShow', ({content}) =>
            this.show(content));

        this.action('detailsShowFeatures', ({features}) =>
            this.show(<FeatureList features={features}/>))
    }

    show(content) {
        if (content)
            app.perform('sidebarShowPanel', {panel: 'details'});
        app.set({
            detailsContent: content
        });

    }
}

class Panel extends React.Component {

    content() {
        let c = this.props.detailsContent;

        if (!c)
            return null;

        if (typeof c === 'string')
            return c;

        if (typeof c === 'function')
            return c();

        return c;
    }

    render() {
        return (
            <Paper zDepth={0}>
                {this.content()}
            </Paper>
        )
    }
}

export default {
    Plugin,
    Panel: app.connect(Panel, ['detailsContent']),
}
