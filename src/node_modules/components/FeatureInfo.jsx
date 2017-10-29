// format a feature for displaying on the details pane

import React from 'react';


function toObject(feature) {
    if (!feature.getProperties) {
        // already an object
        return feature;
    }

    let r = Object.assign({}, feature.getProperties());
    delete r[feature.getGeometryName()];
    r.geometry = feature.getGeometry();
    return r;
}

function isEmpty(val) {
    return typeof(val) === 'undefined' || val === null || !String(val).trim();
}


export default class FeatureInfo extends React.Component {

    render() {
        let obj = toObject(this.props.feature),
            rows = [];

        Object.keys(obj).sort().forEach((key, n) => {
            if (key === 'geometry')
                return;

            let val = obj[key];
            if (isEmpty(val))
                return;

            rows.push(
                <div key={n}>
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

        }}>{rows}</div>;

    }
}

