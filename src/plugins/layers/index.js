import React from 'react';

import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';

import app from 'app';
import ol from 'ol-all';


function buildLayerTree() {

    function _tree(layer) {
        let r = {
            name: layer.get('name'),
            visible: layer.getVisible(),
            uid: ol.getUid(layer),
            kind: layer.get('kind')
        };

        if(layer.getLayers) {
            r.children = [];
            layer.getLayers().forEach(sub => r.children.unshift(_tree(sub)))
        }

        return r;
    }

    return _tree(app.map().getLayerGroup());
}

function setVisible(uid, visible) {
    let layer = app.map().getLayerById(uid);
    if(layer)
        layer.setVisible(visible);
}


class Plugin extends app.Plugin {
    init() {
        this.action('layerSetVisible', ({uid, visible}) =>
            setVisible(uid, visible));

        this.action('layerSetActive', ({uid}) =>
            app.set({layerActiveUid: uid}));

        app.map().getLayerGroup().on('change', () => {
            app.set({layerRoot: buildLayerTree()});
        });
    }
}

class Tree extends React.Component {
    drawLayer(layer) {
        let active = layer.uid === this.props.layerActiveUid;

        return <ListItem
            key={layer.uid}
            initiallyOpen={true}
            primaryText={
                <a
                    style={{
                        color: 'black',
                        backgroundColor: active ? 'red' : 'white'
                    }}
                    onClick={() => app.perform('layerSetActive', {uid: layer.uid})}
                >[{layer.kind}] {layer.name}</a>
            }
            leftCheckbox={
                <Checkbox
                    checked={layer.visible}
                    onCheck={(e, checked) => app.perform('layerSetVisible', {uid: layer.uid, visible: checked})}
                />
            }
            nestedItems={layer.children ? layer.children.map(la => this.drawLayer(la)) : []}
        />
    }

    render() {
        if (!this.props.layerRoot)
            return null;
        return (
            <List>
                {this.drawLayer(this.props.layerRoot)}
            </List>
        );
    }
}

let ConnectedTree = app.connect(Tree, ['layerRoot', 'layerActiveUid']);

class Panel extends React.Component {
    render() {
        return (
            <Paper>
                <ConnectedTree />
            </Paper>
        );
    }
}

export default {
    Plugin,
    Tree: ConnectedTree,
    Panel: app.connect(Panel)
};
