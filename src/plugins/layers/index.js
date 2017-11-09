import React from 'react';

import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import {
    grey300, cyan50, cyan100, cyan300, cyan500
} from 'material-ui/styles/colors';


import app from 'app';
import ol from 'ol-all';

function checkEnabled(layer, res) {
    let min = layer.getMinResolution() || 0;
    let max = layer.getMaxResolution() || Infinity;
    return min <= res && res <= max;
}


function buildLayerTree() {

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

function setVisible(uid, visible) {
    let layer = app.map().getLayerById(uid);
    if (layer)
        layer.setVisible(visible);
}

function update() {
    app.set({layerRoot: buildLayerTree()});
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

class Tree extends React.Component {
    itemStyle(active, visible, enabled) {
        let s = {
            color: cyan100
        };

        if (active)
            s.backgroundColor = cyan50;
        if (visible)
            s.color = cyan300;
        if (!enabled)
            s.color = grey300;

        return s;
    }

    drawLayer(la, level) {
        let active = la.uid === this.props.layerActiveUid;

        return <ListItem
            key={la.uid}
            initiallyOpen={level < 2}
            style={this.itemStyle(active, la.isVisible, la.isEnabled)}
            primaryText={
                <a
                    onClick={evt => {
                        if (la.isEnabled)
                            app.perform('layerSetActive', {uid: la.uid});
                        evt.preventDefault();
                    }
                    }
                >{la.name}</a>
            }
            leftCheckbox={
                <Checkbox
                    disabled={!la.isEnabled}
                    checked={la.isEnabled && la.isVisible}
                    onCheck={(e, checked) => la.isEnabled ?
                        app.perform('layerSetVisible', {uid: la.uid, visible: checked})
                        : null
                    }
                />
            }
            nestedItems={la.children ? la.children.map(la => this.drawLayer(la, level + 1)) : []}
        />
    }

    drawProject(root) {
        for (let g of root.children) {
            if (g.kind === '_PROJECT') {
                return <List>
                    {g.children.map(la => this.drawLayer(la, 0))}
                </List>;
            }
        }
        return null;
    }

    drawBackgrounds(root) {
        for (let g of root.children) {
            if (g.kind === '_BACKGROUND') {
                return <List>
                    {g.children.map(la => this.drawLayer(la, 0))}
                </List>;
            }
        }
        return null;
    }

    render() {
        if (!this.props.layerRoot)
            return null;

        let project = this.drawProject(this.props.layerRoot);
        let backgrounds = this.drawBackgrounds(this.props.layerRoot);

        return (
            <div>
                {project}
                {backgrounds ?
                    <div>
                        <Subheader>{__("backgroundsTitle")}</Subheader>
                        {backgrounds}
                    </div>
                    : null
                }
            </div>
        );
    }
}

let ConnectedTree = app.connect(Tree, ['layerRoot', 'layerActiveUid']);

class Panel extends React.Component {
    render() {
        return (
            <Paper>
                <ConnectedTree/>
            </Paper>
        );
    }
}

export default {
    Plugin,
    Tree: ConnectedTree,
    Panel: app.connect(Panel)
};
