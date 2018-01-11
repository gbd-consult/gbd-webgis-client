import React from 'react';
import TextField from 'material-ui/TextField';

import _ from 'lodash';

import app from 'app';
import ol from 'ol-all';


class Property extends React.Component {
    render() {
        return (
            <div>
                <b>{this.props.label}</b>
                <TextField style={{width: 80}} value={this.props.value}/>
            </div>
        )
    }
}

class LayerEditor extends React.Component {
    render() {
        let la = this.props.editorSelectedLayer;
        if (!la)
            return null;

        let rows = la.getSource().getFeatures().map(feature => ({
            feature,
            uid: ol.getUid(feature),
            name: feature.get('name')
        }));

        rows = _.sortBy(rows, 'name');

        return (
            <div>
                <h3>Layer: {la.get('name')}</h3>
                <h3>Features:</h3>
                {
                    rows.map(r =>
                        <div key={r.uid}
                             style={{cursor: 'pointer'}}
                            onClick={() => app.perform('editorSelectFeature', {feature: r.feature})}
                        >
                            {r.name}
                        </div>
                    )
                }
            </div>
        );
    }
}

export default app.connect(LayerEditor, ['editorSelectedLayer'])
