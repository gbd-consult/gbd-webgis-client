import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';

import _ from 'lodash';

import app from 'app';
import ol from 'ol-all';

import FsList from './FsList';
import './index.sass';

function post(cmd, data, done) {
    data = {
        plugin: 'fs_search',
        cmd,
        ...data
    };
    app.perform('gbdServerPost', {data, done});
}

function loadGemarkungen() {
    post('gemarkungen', {}, ({response, error}) =>
        app.update('gbdFsSearchLists', {gemarkungen: response})
    );
}

function loadStrassen() {
    post('strasse_all', {}, ({response, error}) =>
        app.update('gbdFsSearchLists', {strassen: response})
    );
}

function convert(fs) {
    let wkt = new ol.format.WKT();

    fs.geometry = wkt.readGeometry(fs.wkt_geometry, {
        dataProjection: app.config.str('map.crs.server'),
        featureProjection: app.config.str('map.crs.client')
    });
    return fs;
}

class Plugin extends app.Plugin {
    init() {
        app.set({
            gbdFsSearchForm: {},
            gbdFsSearchLists: {}
        });

        this.action('authUserChanged', () => {
            post('check_enabled', {}, ({response}) => {
                app.update('sidebarVisiblePanel', {fs_search: response.enabled});
                if (response.enabled) {
                    loadGemarkungen();
                    loadStrassen();
                } else {
                    app.set({
                        gbdFsSearchForm: {},
                        gbdFsSearchResults: null
                    });
                }
            });
        });

        this.action('gbdFsSearchFormSubmit', () => {
            let data = {
                ...app.get('gbdFsSearchForm'),
                allprops: true,
            };

            let sel = app.get('selectionGeometryWKT');
            if (sel) {
                data.selection = sel;
            }

            post('find', data, ({response, error}) => {
                app.set({gbdFsSearchResults: response.map(convert)});
                app.perform('detailsShow', {content: <FsList/>})
            });
        });

        this.action('gbdFsSearchDetailsLoad', ({fs}) =>
            post('infobox', {plugin: 'fs_details', gml_id: fs.gml_id}, ({response}) =>
                app.set({
                    gbdFsSearchResults: app.get('gbdFsSearchResults').map(f =>
                        f === fs ? {...fs, details: response.html} : f
                    )
                })));

        this.action('gbdFsSearchDetailsPrint', ({fs}) => {
            let map = app.map(),
                mapName = null,
                layers = map.getLayerRoot().collect(la => {
                    if (la.isVisible() && la.wmsName) {
                        let m = _.get(la, 'config.params.map');
                        if (m)
                            mapName = m;
                        return la.wmsName();
                    }
                }),
                extent = map.getView().calculateExtent();

            let data = {
                plugin: 'fs_details',
                gml_id: fs.gml_id,
                map: mapName,
                layers: layers.reverse(),
                extra_features: [{
                    plugin: 'marker',
                    wkt: fs.wkt_geometry
                }],
                'map0:extent': extent
            };

            post('print', data, ({response}) => {
                let url = app.config.str('server.url') + `download/${response.uid}.pdf`;
                app.perform('dialogShow', {url});
            });
        });
    }
}

class Row extends React.Component {
    render() {
        return (
            <div style={{display: 'flex', padding: '6px 0'}}>
                {this.props.children}
            </div>
        );
    }
}

class Cell extends React.Component {
    render() {
        return (
            <div style={{flex: this.props.flex || 1, padding: '0 8px'}}>
                {this.props.children}
            </div>
        );
    }
}

class Field extends React.Component {
    render() {
        return (
            <TextField
                id={'gbd_fs_search_' + this.props.name}
                fullWidth={true}
                hintText={this.props.hintText}
                value={this.props.form[this.props.name] || ''}
                onChange={(evt, val) => app.update('gbdFsSearchForm', {[this.props.name]: val})}
            />
        );
    }
}

class Select extends React.Component {
    render() {
        return (
            <SelectField
                id={'gbd_fs_search_' + this.props.name}
                fullWidth={true}
                hintText={this.props.hintText}
                value={this.props.form[this.props.name] || ''}
                onChange={(evt, key, val) => app.update('gbdFsSearchForm', {[this.props.name]: val})}
            >{this.props.children}</SelectField>
        );
    }
}

class Combo extends React.Component {
    render() {
        return (
            <AutoComplete
                id={'gbd_fs_search_' + this.props.name}
                fullWidth={true}
                hintText={this.props.hintText}
                value={this.props.form[this.props.name] || ''}
                dataSource={this.props.dataSource}
                filter={(searchText, key) => (key.toLowerCase().indexOf(searchText.toLowerCase()) === 0)}
                onUpdateInput={(val) => app.update('gbdFsSearchForm', {[this.props.name]: val})}
            />
        );
    }
}

class Form extends React.Component {
    render() {
        let form = this.props.gbdFsSearchForm,
            lists = this.props.gbdFsSearchLists;

        if (!form)
            return null;

        let gemarkungMenu = [], strasseMenu = [];

        if (lists.gemarkungen) {
            gemarkungMenu = lists.gemarkungen.map(v =>
                <MenuItem key={v[0]} value={v[0]} primaryText={v[1]}/>
            );

            if (form.gemarkungsnummer && lists.strassen)
                strasseMenu = lists.strassen
                    .filter(v => v[1].includes(Number(form.gemarkungsnummer)))
                    .map(v => v[0]);
        }

        let withOwner = this.props.authUser && this.props.authUser.permissions.includes('FS_SEARCH_VIEW_OWNER'),
            withBB = this.props.authUser && this.props.authUser.permissions.includes('FS_SEARCH_VIEW_BB');

        return (
            <div style={app.theme('gwc.plugin.gbd_fs_search.formBox')}>
                {withOwner && <Row>
                    <Cell>
                        <Field name={'nachnameoderfirma'} hintText={'Nachname (Firma)'} form={form}/>
                    </Cell>
                </Row>}
                {withOwner && <Row>
                    <Cell>
                        <Field name={'vorname'} hintText={'Vorname'} form={form}/>
                    </Cell>
                </Row>}
                <Row>
                    <Cell>
                        <Field name={'_fsnumber'} hintText={'Nummer-Zähler/Nenner'} form={form}/>
                    </Cell>
                </Row>
                <Row>
                    <Cell>
                        <Select name={'gemarkungsnummer'} hintText={'Gemarkung'} form={form}>{gemarkungMenu}</Select>
                    </Cell>
                </Row>
                <Row>
                    <Cell flex={3}>
                        <Combo name={'strasse'} hintText={'Straße'} form={form} dataSource={strasseMenu}/>
                    </Cell>
                    <Cell>
                        <Field name={'hausnummer'} hintText={'Nr'} form={form}/>
                    </Cell>
                </Row>
                <div style={{paddingTop: 16, textAlign: 'right'}}>
                    <RaisedButton
                        label="Suchen"
                        onClick={() => app.perform('gbdFsSearchFormSubmit')}
                    />
                </div>
            </div>
        );
    }
}


class Panel extends React.Component {
    render() {
        return (
            <Paper zDepth={0} style={app.theme('gwc.plugin.gbd_fs_search.panel')}>
                <Paper zDepth={0} style={app.theme('gwc.plugin.gbd_fs_search.formContainer')}>
                    <Form {...this.props} />
                </Paper>

            </Paper>

        );
    }
}

export default {
    Plugin,
    Panel: app.connect(Panel, ['authUser', 'gbdFsSearchForm', 'gbdFsSearchLists'])
};
