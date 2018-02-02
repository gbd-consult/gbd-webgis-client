import React from 'react';
import IconButton from 'material-ui/IconButton';

import _ from 'lodash';
import htmlToReact from 'html-to-react';

import app from 'app';
import ol from 'ol-all';

import Section from 'components/Section';
import SimpleButton from 'components/SimpleButton';


class FsList extends React.Component {

    header(fs) {
        return <span>
            {fs.gemarkung}&nbsp;
            {fs.flurnummer}/
            {fs.zaehlernenner}
        </span>
    }

    cleanup(src) {
        let r = {};

        _.keys(src).forEach(k => {
            if (k === 'geometry' || k[0] === '_')
                return;
            let v = src[k];
            if (!_.isString(v) || v === 'NULL')
                return;
            r[k] = v;
        });

        return r;
    }

    content(fs) {
        if (fs.details) {
            return (
                <div className='gbd_fs_search_details'>
                    {new htmlToReact.Parser().parse(fs.details)}
                    <IconButton
                        tooltip={'Datenblatt drucken'}
                        tooltipPosition='top-center'
                        tooltipStyles={{position: 'absolute'}}
                        onClick={() => app.perform('gbdFsSearchDetailsPrint', {fs})}
                    >
                        <SimpleButton icon='print'/>
                    </IconButton>
                </div>
            );
        }
        return ' ';
    }

    mark(fs) {
        app.perform('markerMark', {
            features: [new ol.Feature(fs.geometry)],
            zoom: true,
            animate: true,
            popup: this.header(fs)
        });
    }

    toggleClick(fs, open) {
        if (open)
            this.mark(fs);
        if (open && !fs.details)
            app.perform('gbdFsSearchDetails', {
                fs, done: ({response}) => {
                    let d = app.get('gbdFsSearchResults').map(f =>
                        f === fs ? {...fs, details: response.html} : f
                    );
                    app.set({gbdFsSearchResults: d})
                }
            })
    }

    render() {
        return (
            <div style={app.theme('gwc.plugin.details.featureList.container')}>
                {this.props.gbdFsSearchResults.map((fs, n) => <Section
                        key={fs.gml_id}
                        open={false}
                        header={this.header(fs)}
                        toggleClick={open => this.toggleClick(fs, open)}
                        icon={'center_focus_weak'}
                        iconClick={() => {
                            app.perform('sidebarBlur');
                            this.mark(fs)
                        }}
                    >{this.content(fs)}</Section>
                )}
            </div>
        )
    }
}

export default app.connect(FsList, ['gbdFsSearchResults']);
