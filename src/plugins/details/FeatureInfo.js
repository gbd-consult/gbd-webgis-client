// format a feature for displaying on the details pane

import React from 'react';

import FlatButton from 'material-ui/FlatButton';

import _ from 'lodash';

import app from 'app';

export default class FeatureInfo extends React.Component {

    button() {
        let geom = this.props.feature.getGeometry();
        if(!geom)
            return null;
        return (
            <FlatButton
                label={"show"}
                onClick={() => app.perform('markerMark', {
                    features: [this.props.feature],
                    pan: true
                })}
            />
        )
    }

    render() {
        let props = this.props.feature.getProperties(),
            rows = [];

        Object.keys(props).sort().forEach(key => {
            let val = props[key];

            if(_.isEmpty(val) || key === 'geometry')
                return;

            rows.push(
                <div key={key}>
                    <b>{key}</b>
                    <span>{val}</span>
                </div>
            );
        });

        if (!rows.length)
            return null;

        return <div style={{
            border: '1px solid red',
            padding: 10,
            margin: 10

        }}>
            {rows}
            {this.button()}
        </div>;

    }
}

