// Display a list of features in the details pane.

import React from 'react';

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

        let style = {
            div: app.theme('gwc.plugin.details.featureList.more'),
            maptip: app.theme('gwc.plugin.details.featureList.maptip'),
            table: app.theme('gwc.plugin.details.featureList.table'),
            tr: app.theme('gwc.plugin.details.featureList.tr'),
            trEven: app.theme('gwc.plugin.details.featureList.trEven'),
            th: app.theme('gwc.plugin.details.featureList.th'),
            td: app.theme('gwc.plugin.details.featureList.td'),
            a: app.theme('gwc.plugin.details.featureList.a'),
        };

        let breakWords = s => s.replace(/\S{30}/g, '$&\u00ad');

        let format = s => {
            if (s.match(/^https?:\/\//))
                return <a style={style.a} href={s} target='_blank'>{s}</a>;
            if (s.match(/^\S+@.+?\.[a-z]{2,5}$/))
                return <a style={style.a} href={'mailto:' + s}>{s}</a>;
            return breakWords(s);
        };

        return (
            <div style={style.div}>
                {maptip && <div style={style.maptip}>{maptip}</div>}
                <table style={style.table}>
                    <tbody>
                    {
                        _.keys(props).sort().map((key, i) =>
                            <tr key={key} style={i % 2 ? style.tr : style.trEven}>
                                <th style={style.th}>{key}</th>
                                <td style={style.td}>{format(props[key])}</td>
                            </tr>)
                    }
                    </tbody>
                </table>
            </div>
        )
    }

    click(feature) {
        app.perform('markerMark', {
            features: [feature],
            zoom: true,
            animate: true
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
