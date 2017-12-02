// Display a list of features in the details pane.

import React from 'react';

import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import _ from 'lodash';

import app from 'app';
import Section from 'components/Section';


export default class FeatureList extends React.Component {

    header(feature) {
        return feature.get('layerName') + ': ' + feature.getId();
    }

    content(feature) {
        return (
            <div style={app.theme('gwc.plugin.details.featureList.more')}>
                <Table>
                    <TableBody
                        displayRowCheckbox={false}
                    >
                        {
                            _.sortBy(_.toPairs(feature.getProperties())).map(([key, val]) =>
                                val && key !== 'geometry' && (
                                    <TableRow height={32} key={key} displayBorder={true}>
                                        <TableRowColumn style={{height: 'auto'}}><b>{key}</b></TableRowColumn>
                                        <TableRowColumn style={{height: 'auto'}}>{val}</TableRowColumn>
                                    </TableRow>)
                            )
                        }
                    </TableBody>
                </Table>
            </div>
        )
    }

    click(feature) {
        app.perform('markerMark', {
            features: [feature],
            pan: true
        });

    }

    render() {
        let features = _.sortBy(this.props.features, f => f.get('layerName'));

        return (
            <div style={app.theme('gwc.plugin.details.featureList.container')}>
                {features.map((f, n) => <Section
                        key={f.getId()}
                        open={features.length === 1}
                        header={this.header(f)}
                        icon={'center_focus_weak'}
                        iconClick={() => this.click(f)}
                    >{this.content(f)}</Section>
                )}
            </div>
        )
    }
}
