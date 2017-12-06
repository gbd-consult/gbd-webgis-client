// Display a list of features in the details pane.

import React from 'react';

import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import _ from 'lodash';
import htmlToReact from 'html-to-react';

import app from 'app';
import Section from 'components/Section';


export default class FeatureList extends React.Component {

    header(feature) {
        return feature.get('_layerTitle') + ': ' + feature.getId();
    }

    cleanup(src) {
        let r = {};

        _.keys(src).forEach(k => {
            if (k === 'geometry' || k[0] === '_')
                return;
            let v = src[k];
            if (_.isNil(v) || v === 'NULL')
                return;
            r[k] = v;
        });

        return r;
    }

    content(feature) {
        let props = this.cleanup(feature.getProperties());
        let maptip = null;

        if (props.maptip) {
            maptip = new htmlToReact.Parser().parse(props.maptip);
            delete props.maptip;
        }

        return (
            <div style={app.theme('gwc.plugin.details.featureList.more')}>
                {
                    maptip &&
                    <div style={app.theme('gwc.plugin.details.featureList.maptip')}>{maptip}</div>
                }
                <Table>
                    <TableBody displayRowCheckbox={false}>
                        {
                            _.keys(props).sort().map(key =>
                                <TableRow height={32} key={key} displayBorder={true}>
                                    <TableRowColumn style={{height: 'auto'}}><b>{key}</b></TableRowColumn>
                                    <TableRowColumn style={{height: 'auto'}}>{props[key]}</TableRowColumn>
                                </TableRow>)
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
        let features = _.sortBy(this.props.features, f => f.get('_layerTitle'));

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
