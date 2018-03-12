import React from 'react';
import Paper from 'material-ui/Paper';

import _ from 'lodash';

import app from 'app';
import ol from 'ol-all';

import Section from 'components/Section';

class Plugin extends app.Plugin {
    init() {
        this.action('layerToggleVisible', ({layer}) =>
            layer.setVisible(!layer.isVisible(), true));

        this.action('layerToggleSelected', ({layer}) =>
            app.map().setSelectedLayer(
                layer === app.map().getSelectedLayer() ? null : layer));

        this.rc = 0;

        app.map().on('layerTreeChanged', () => app.set({
            'layerTreeVersion': ++this.rc
        }));
    }
}

class Layer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {open: true}
    }

    linkClick() {
        app.perform('layerToggleSelected', {layer: this.props.layer});
    }

    visibilityClick() {
        app.perform('layerToggleVisible', {layer: this.props.layer});
    }

    toggleClick(layer, open) {
        app.update('layerOpenState', {
            [ol.getUid(layer)]: open
        });
    }

    status(layer) {
        if (layer === this.props.selected)
            return 'Selected';
        if (!layer.isEnabled())
            return 'Disabled';
        if (!layer.isVisible())
            return 'Hidden';
        return '';
    }

    render() {

        let layer = this.props.layer,
            status = this.status(layer),
            headerStyle = app.theme('gwc.plugin.layers.title' + status),
            visIcon = layer.isEnabled() ? ((!layer.isVisible()) ? 'visibility_off' : 'visibility') : null,
            open = (this.props.layerOpenState || {})[ol.getUid(layer)];

        if (_.isNull(open))
            open = app.get('layerTreeExpanded');

        if (!layer.isEnabled())
            return null;

        return (
            <Section
                header={
                    <div style={headerStyle} onClick={() => this.linkClick()}>
                        {layer.getTitle()}
                    </div>
                }
                icon={visIcon}
                iconClick={() => this.visibilityClick()}
                toggleClick={(open) => this.toggleClick(layer, open)}
                indent={true}
                open={open}
            >
                {layer.isGroup() && layer.getLayers().map(n => <Layer
                    key={n.uid}
                    layer={n}
                    selected={this.props.selected}
                    layerOpenState={this.props.layerOpenState}
                />)}
            </Section>
        );
    }
}


class LayerTree extends React.Component {

    render() {
        return (
            <div>
                {this.props.root.getLayers().map(layer => <Layer
                    key={layer.uid}
                    layer={layer}
                    selected={this.props.selected}
                    layerOpenState={this.props.layerOpenState}
                />)}
            </div>
        );
    }
}

class LayerInfo extends React.Component {
    render() {
        let url = this.props.layer.wmsLegendURL && this.props.layer.wmsLegendURL();
        if (!url)
            return null;
        return (
            <Paper style={app.theme('gwc.plugin.layers.infoContainer')}>
                <img src={url}/>
            </Paper>
        );
    }
}

class Panel extends React.Component {
    render() {
        let root = app.map().getLayerRoot(),
            selected = app.map().getSelectedLayer();

        if (!root)
            return null;

        return (
            <Paper style={app.theme('gwc.plugin.layers.panel')}>
                <Paper style={app.theme('gwc.plugin.layers.treeContainer')}>
                    <LayerTree
                        root={root}
                        selected={selected}
                        layerOpenState={this.props.layerOpenState}
                    />
                </Paper>
                {selected && <LayerInfo layer={selected}/>}
            </Paper>
        );
    }
}

export default {
    Plugin,
    Panel: app.connect(Panel, ['appIsMobile', 'layerTreeVersion', 'layerOpenState'])
};
