import React from 'react';
import Paper from 'material-ui/Paper';

import app from 'app';
import ol from 'ol-all';

import Section from 'components/Section';

function checkEnabled(layer, res) {
    let min = layer.getMinResolution() || 0;
    let max = layer.getMaxResolution() || Infinity;
    return min <= res && res <= max;
}

function layerDef() {

    function _tree(layer) {

        let r = {
            name: layer.get('name'),
            uid: ol.getUid(layer),
            kind: layer.get('kind'),
            isVisible: layer.getVisible(),
            isGroup: layer instanceof ol.layer.Group
        };

        if (layer.getLayers) {
            r.children = [];
            layer.getLayers().forEach(sub => r.children.unshift(_tree(sub)))
            r.isEnabled = r.children.some(c => c.isEnabled);
        } else {
            r.isEnabled = checkEnabled(layer, res);
        }

        return r;
    }

    let res = app.map().getView().getResolution();
    return _tree(app.map().getLayerGroup());
}

function activeLayer() {
    return app.map().getLayerById(app.get('layerActiveUid'));
}

function setVisibleRec(layer, visible) {
    layer.setVisible(visible);
    if (layer.getLayers)
        layer.getLayers().forEach(la => setVisibleRec(la, visible));
}


function setVisible(uid, visible) {
    let layer = app.map().getLayerById(uid);
    if (layer)
        setVisibleRec(layer, visible);
}

function update() {
    app.set({layerDef: layerDef()});
}


class Plugin extends app.Plugin {
    init() {
        this.action('layerSetVisible', ({uid, visible}) =>
            setVisible(uid, visible));

        this.action('layerSetActive', ({uid}) =>
            app.set({layerActiveUid: uid}));

        this.action('layerToggleActive', ({uid}) => {
            let a = app.get('layerActiveUid');
            app.set({
                layerActiveUid: uid === a ? 0 : uid
            });
        });

        app.map().getLayerGroup().on('change', update);
        app.map().getView().on('change:resolution', update);
    }
}

class Layer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {open: true}
    }

    linkClick() {
        app.perform('layerToggleActive', {uid: this.props.def.uid});
    }

    visibilityClick() {
        app.perform('layerSetVisible', {
            uid: this.props.def.uid,
            visible: !this.props.def.isVisible
        });
    }

    status() {
        let d = this.props.def;

        if (d.uid === this.props.layerActiveUid)
            return 'Active';
        if (!d.isEnabled)
            return 'Disabled';
        if (!d.isVisible)
            return 'Hidden';
        return '';
    }

    visibilityIcon(status) {
        if (status === 'Disabled')
            return null;
        return (status === 'Hidden') ? 'visibility_off' : 'visibility';
    }

    header(status) {
        let style = app.theme('gwc.plugin.layers.title' + status);

        return (
            <div style={style} onClick={() => this.linkClick()}>
                {this.props.def.name}
            </div>
        );
    }

    render() {
        let def = this.props.def,
            status = this.status();

        return (
            <Section
                header={this.header(status)}
                icon={this.visibilityIcon(status)}
                iconClick={() => this.visibilityClick()}
                indent={true}
            >
                {def.isGroup && def.children.map(d => <Layer
                    key={d.uid}
                    def={d}
                    layerActiveUid={this.props.layerActiveUid}
                />)}
            </Section>
        );
    }
}


class LayerTree extends React.Component {

    render() {
        if (!this.props.layerDef)
            return null;

        let projectDef = this.props.layerDef.children.filter(d => d.kind === '_PROJECT');

        if (!projectDef.length || !projectDef[0].children)
            return null;

        return (
            <div>
                {projectDef[0].children.map(d => <Layer
                    key={d.uid}
                    def={d}
                    layerActiveUid={this.props.layerActiveUid}
                />)}
            </div>
        );
    }
}

class LayerInfo extends React.Component {
    render() {
        let data = this.props.data;
        return (
            <div>
                {data.wmsLegendURL && <img
                    src={data.wmsLegendURL}
                />}
            </div>
        );
    }
}

class Panel extends React.Component {
    render() {
        let active = activeLayer();

        return (
            <Paper style={app.theme('gwc.plugin.layers.panel')}>
                <Paper style={app.theme('gwc.plugin.layers.treeContainer')}>
                    <LayerTree {...this.props} />
                </Paper>
                {active && <Paper style={app.theme('gwc.plugin.layers.infoContainer')}>
                    <LayerInfo data={active.getProperties()}/>
                </Paper>}
            </Paper>
        );
    }
}

export default {
    Plugin,
    Panel: app.connect(Panel, ['appIsMobile', 'layerDef', 'layerActiveUid'])
};
