import React from 'react';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

import app from 'app';
import ol from 'ol-all';

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

class Icon extends React.Component {
    render() {
        let css = this.props.css;
        return (
            <IconButton
                style={{
                    boxSizing: 'border-box',
                    margin: 0,
                    padding: 0,
                    width: css.dim.button.size,
                    height: css.dim.button.size,
                    transform: this.props.rotated ?
                        'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.5s ease'
                }}
                iconStyle={{
                    fontSize: css.dim.button.fontSize,
                    margin: 0,
                    padding: 0,
                    color: css.color.button[this.props.status]
                }}
                onClick={this.props.onClick}
            >
                <FontIcon className='material-icons'>{this.props.icon}</FontIcon>
            </IconButton>
        );
    }
}

class Layer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {open: true}
    }

    groupClick() {
        this.setState({open: !this.state.open});
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

    render() {
        let def = this.props.def,
            css = this.props.css,
            status;

        if (!def.isEnabled)
            status = 'disabled';
        else if (!def.isVisible)
            status = 'hidden';
        else if (def.uid === this.props.layerActiveUid)
            status = 'active';
        else
            status = 'normal';

        return (
            <div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <div style={{width: css.dim.button.size}}>
                        {def.isGroup && <Icon
                            icon='keyboard_arrow_right'
                            css={css}
                            status={status}
                            rotated={this.state.open}
                            onClick={() => this.groupClick()}
                        />}
                    </div>
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        borderBottomWidth: css.underlineWidth,
                        borderBottomStyle: 'solid',
                        borderBottomColor: css.underlineColor
                    }}>
                        <div style={{
                            flex: 1,
                            fontSize: css.dim.link.fontSize,
                            cursor: 'pointer',
                            lineHeight: '120%',
                            padding: '4px 8px',
                            borderRadius: 10,
                            backgroundColor: css.color.background[status] || 'transparent',
                            color: css.color.link[status]
                        }}
                             onClick={() => this.linkClick()}
                        >
                            {def.name}
                        </div>
                        <div style={{height: css.dim.button.size}}>

                            {status !== 'disabled' && <div>
                                <Icon
                                    icon={status === 'hidden' ? 'visibility_off' : 'visibility'}
                                    css={css}
                                    status={status}
                                    onClick={() => this.visibilityClick()}
                                />
                            </div>}
                        </div>
                    </div>
                </div>

                {
                    def.isGroup && this.state.open && <div style={{
                        marginLeft: css.dim.link.indent,
                    }}>
                        {def.children.map(d => <Layer
                            key={d.uid}
                            def={d}
                            css={css}
                            layerActiveUid={this.props.layerActiveUid}
                        />)}
                    </div>
                }

            </div>
        )
    }


}


class LayerTree extends React.Component {

    css() {
        let th = app.theme().gbd.plugin.layers;
        return {...th, dim: th['dim' + (this.props.appIsMobile ? 'Mobile' : 'Desktop')]}
    }

    render() {
        if (!this.props.layerDef)
            return null;

        let projectDef = this.props.layerDef.children.filter(d => d.kind === '_PROJECT');

        if (!projectDef.length || !projectDef[0].children)
            return null;

        let css = this.css();

        return (
            <div>
                {projectDef[0].children.map(d => <Layer
                    key={d.uid}
                    def={d}
                    css={css}
                    layerActiveUid={this.props.layerActiveUid}
                />)}
            </div>
        );
    }
}

class LayerInfo  extends React.Component {
    render() {
        let data = this.props.data;
        return (
            <div>
                { data.wmsLegendURL && <img
                    src={data.wmsLegendURL}
                /> }
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
