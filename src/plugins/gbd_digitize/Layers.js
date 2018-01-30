import React from 'react';

import app from 'app';
import Section from 'components/Section';

const noLabel = __("gwc.plugin.gbd_digitize.noLabel");

class Layer extends React.Component {
    click(object) {
        app.perform('editorSelect', {object})
    }

    visibilityClick(object) {
        app.perform('editorToggleVisible', {object})
    }

    render() {
        let la = this.props.layer,
            features = la.getSource().getFeatures(),
            visible = la.getVisible(),
            style = id => (id === this.props.editorSelectedID)
                ? app.theme('gwc.plugin.gbd_digitize.treeSelected')
                : (visible ?
                    app.theme('gwc.plugin.gbd_digitize.tree') :
                    app.theme('gwc.plugin.gbd_digitize.treeHidden')),
            visIcon = visible ? 'visibility' : 'visibility_off';


        return (
            <Section
                header={
                    <div
                        style={style(la.get('layerID'))}
                        onClick={() => this.click(la)}
                    >
                        {this.props.layer.get('props').label || noLabel}
                    </div>
                }
                icon={visIcon}
                iconClick={() => this.visibilityClick(la)}
                indent={true}
            >
                {features.map(f => <Section
                        key={f.get('featureID')}
                        header={
                            <div
                                style={style(f.get('featureID'))}
                                onClick={() => this.click(f)}
                            >
                                {f.get('props').label || noLabel}
                            </div>
                        }
                        indent={true}
                    />
                )}
            </Section>

        )
    }
}


class Layers extends React.Component {
    render() {

        let g = app.map().getGroup('editor'),
            layers = [];

        if (g) {
            layers = g.getLayers().getArray();
        }

        return (
            <div style={app.theme('gwc.plugin.gbd_digitize.layers')}>
                {layers.map(la => <Layer
                    key={la.get('layerID')}
                    layer={la}
                    editorSelectedID={this.props.editorSelectedID}
                />)}
            </div>
        );
    }
}

export default Layers;
