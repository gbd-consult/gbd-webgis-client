// Display a list of features in the details pane.

import React from 'react';

import FeatureInfo from './FeatureInfo';


export default class FeatureList extends React.Component {

    render() {
        return (
            <div>
                {this.props.features.map((f, n) => <FeatureInfo key={n} feature={f}/>)}
            </div>
        )
    }
}
