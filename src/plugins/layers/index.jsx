import React from 'react';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';

import app from 'app';
import ol from 'ol-all';


function buildLayerTree() {

    function _tree(layer) {
        let r = {
            name: layer.get('name'),
            visible: layer.getVisible(),
            uid: ol.getUid(layer),
            type: layer.get('type')
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
                >[{layer.type}] {layer.name}</a>
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
            <Drawer style={{width: '300px'}}>
                <List>{this.drawLayer(this.props.layerRoot)}</List>
            </Drawer>
        );
    }
}

export default {
    Plugin,
    Tree: app.connect(Tree, ['layerRoot', 'layerActiveUid'])
};
