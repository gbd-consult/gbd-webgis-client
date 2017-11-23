import React from 'react';

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
    let active = activeLayer();
    if (!active || !active.getVisible())
        app.set({layerActiveUid: 0});
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
        app.perform('layerSetActive', {uid: this.props.def.uid});
    }

    visibilityClick() {
        app.perform('layerSetVisible', {
            uid: this.props.def.uid,
            visible: !this.props.def.isVisible
        });
    }

    status() {
        let d = this.props.def;

        if (!d.isEnabled)
            return 'disabled';
        if (!d.isVisible)
            return 'hidden';
        if (d.uid === this.props.layerActiveUid)
            return 'active';
        return 'normal';
    }

    visibilityIcon(status) {
        if(status === 'disabled')
            return null;
        return (status === 'hidden') ? 'visibility_off' : 'visibility';
    }

    header(status) {
        return (
            <div style={{
                cursor: 'pointer',
                lineHeight: '120%',
                padding: '4px 8px',
                borderRadius: 10,
                backgroundColor: this.props.theme.background[status] || 'transparent',
            }}
                 onClick={() => this.linkClick()}
            >
                {this.props.def.name}
            </div>
        );
    }

    render() {
        let def = this.props.def,
            status = this.status(),
            th = {
                ...this.props.theme,
                textColor: this.props.theme.linkColor[status],
                buttonColor: this.props.theme.buttonColor[status]
            };

        return (
            <Section
                theme={th}
                header={this.header(status)}
                icon={this.visibilityIcon(status)}
                iconClick={() => this.visibilityClick()}
            >
                {def.isGroup && def.children.map(d => <Layer
                    key={d.uid}
                    def={d}
                    theme={this.props.theme}
                    layerActiveUid={this.props.layerActiveUid}
                />)}
            </Section>
        );
    }
}


class LayerTree extends React.Component {

    theme() {
        let th = app.theme().gbd.ui.section;

        return {
            ...th,
            ...th[(this.props.appIsMobile ? 'mobile' : 'desktop')],
            ...app.theme().gbd.plugin.layers
        };
    }

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
                    theme={this.theme()}
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
            <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column'

            }}>
                <div style={{
                    padding: 8,
                    overflow: 'auto',
                    flex: 1
                }}>
                    <LayerTree {...this.props} />
                </div>
                {active && <div style={{
                    height: 200,
                    padding: 8,
                    textAlign: 'center',
                    overflow: 'auto',
                    borderTopWidth: 2,
                    borderTopStyle: 'solid',
                    borderTopColor: app.theme().palette.accent1Color,
                    backgroundColor: app.theme().palette.borderColor,

                }}>
                    <LayerInfo data={active.getProperties()}/>
                </div>}
            </div>
        );
    }
}

export default {
    Plugin,
    Panel: app.connect(Panel, ['appIsMobile', 'layerDef', 'layerActiveUid'])
};
