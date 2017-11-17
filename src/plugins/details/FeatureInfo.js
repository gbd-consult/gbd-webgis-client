// format a feature for displaying on the details pane

import React from 'react';

import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';

import _ from 'lodash';

import app from 'app';

export default class FeatureInfo extends React.Component {

    button() {
        let geom = this.props.feature.getGeometry();
        if(!geom)
            return null;
        return (
            <FontIcon
                className='material-icons'
                onClick={() => app.perform('markerMark', {
                    features: [this.props.feature],
                    pan: true
                })}
            >
                open_with
            </FontIcon>
        )
    }

    focus_feature() {
        let geom = this.props.feature.getGeometry();
        if(!geom)
            return null;
        app.perform('markerMark', {
            features: [this.props.feature],
            pan :true
        });
    }

    render() {
        let props = this.props.feature.getProperties(),
            rows = [],
            title = 'ObjectID';

        Object.keys(props).sort().forEach(key => {
            let val = props[key];

            if(key === 'gml_id'){
                title = val;
                return;
            }

            if(_.isEmpty(val) || key === 'geometry')
                return;

            rows.push(
                <ListItem
                    key={key}
                    primaryText={key}
                    secondaryText={val}
                />
            );
        });

        if (!rows.length)
            return null;

        return (
            <ListItem
                primaryText={title}
                onClick={() => this.focus_feature()}
                initiallyOpen={true}
                nestedItems={rows}
            />
        );

    }
}

