import React from 'react';
import TextField from 'material-ui/TextField';

import app from 'app';
import ol from 'ol-all';


class Property extends React.Component {
    render() {
        return (
            <div>
                <b>{this.props.label}</b>
                <TextField style={{width: 80}} value={this.props.value || ''}/>
            </div>
        )
    }
}

class FeatureEditor extends React.Component {
    render() {
        let f = this.props.editorSelectedFeature;
        if (!f)
            return null;

        let props = {...f.getProperties()};
        delete props.geometry;

        return (
            <div>
                {
                    Object.keys(props).map(k =>
                        <Property key={k} label={k} value={props[k]}/>
                    )
                }
            </div>
        );
    }
}

export default app.connect(FeatureEditor, ['editorSelectedFeature'])
