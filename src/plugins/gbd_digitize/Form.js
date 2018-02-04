import React from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';

import _ from 'lodash';

import app from 'app';
import ol from 'ol-all';

import ColorPicker from 'components/ColorPicker';
import Grid from 'components/Grid';


class Field extends React.Component {
    render() {
        return (
            <TextField
                id={'editor_' + this.props.name}
                fullWidth={true}
                hintText={this.props.hintText}
                value={this.props.form[this.props.name] || ''}
                onChange={(evt, val) => this.props.onChange(this.props.name, val)}
            />
        );
    }
}

class Select extends React.Component {
    render() {
        return (
            <SelectField
                id={'editor_' + this.props.name}
                fullWidth={true}
                hintText={this.props.hintText}
                value={this.props.form[this.props.name] || ''}
                onChange={(evt, key, val) => this.props.onChange(this.props.name, val)}
            >{this.props.children}</SelectField>
        );
    }
}

class Color extends React.Component {
    render() {
        return (
            <ColorPicker
                id={'editor_' + this.props.name}
                hintText={this.props.hintText}
                value={this.props.form[this.props.name] || ''}
                onChange={(evt, val) => this.props.onChange(this.props.name, val)}
                colors={[
                    'rgba(244,67,54,0.8)',
                    'rgba(233,30,99,0.8)',
                    'rgba(156,39,176,0.8)',
                    'rgba(103,58,183,0.8)',
                    'rgba(63,81,181,0.8)',
                    'rgba(33,150,243,0.8)',
                    'rgba(3,169,244,0.8)',
                    'rgba(0,188,212,0.8)',
                    'rgba(0,150,136,0.8)',
                    'rgba(76,175,80,0.8)',
                    'rgba(139,195,74,0.8)',
                    'rgba(205,220,57,0.8)',
                    'rgba(255,235,59,0.8)',
                    'rgba(255,193,7,0.8)',
                    'rgba(255,152,0,0.8)',
                    'rgba(255,87,34,0.8)',
                    'rgba(121,85,72,0.8)',
                    'rgba(158,158,158,0.8)',
                    'rgba(96,125,139,0.8)',
                ]}
            />
        );
    }
}

let replace = (a, n, v) => {
    let b = [...a];
    b[n] = v;
    return b;
};

let empty = x => _.isNil(x) ? '' : x;

class LayerForm extends React.Component {
    render() {

        let schema = (this.props.form.schema || []),
            attrData = schema.map((attrName, n) => ({
                key: n,
                values: [attrName],
                editable: [true]
            })).filter(row => !_.isNil(row.values[0]));

        return (
            <div>
                <Field
                    name={'label'}
                    hintText={__("gwc.plugin.gbd_digitize.label")}
                    {...this.props} />
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <h5>{__("gwc.plugin.gbd_digitize.fill")}</h5>
                    <Color name={'fillColor'} {...this.props} />
                    <h5>{__("gwc.plugin.gbd_digitize.stroke")}</h5>
                    <Color name={'strokeColor'} {...this.props} />
                </div>
                <div>
                    <h5>{__("gwc.plugin.gbd_digitize.attrTitle")}</h5>
                    <Grid
                        data={attrData}
                        onAddRow={() => this.props.onChange('schema', schema.concat(''))}
                        onDeleteRow={r => this.props.onChange('schema', replace(schema, r, null))}
                        onChange={(r, c, val) => this.props.onChange('schema', replace(schema, r, val))}
                    />
                </div>
            </div>
        );
    }
}

class FeatureForm extends React.Component {
    render() {
        let schema = this.props.layerProps.schema || [],
            attr = this.props.form.attr || [],
            attrData = schema.map((attrName, n) => ({
                key: n,
                values: [attrName, empty(attr[n])],
                editable: [false, true]
            })).filter(row => row.values[0]);

        return (
            <div>
                <div>
                    <Field name={'label'} hintText={__("gwc.plugin.gbd_digitize.label")} {...this.props} />
                </div>
                {!!attrData.length && <div>
                    <h5>{__("gwc.plugin.gbd_digitize.attrTitle")}</h5>
                    <Grid
                        data={attrData}
                        onChange={(r, c, val) => this.props.onChange('attr', replace(attr, r, val))}
                    />
                </div>}
            </div>
        );
    }
}

class Form extends React.Component {
    render() {
        let selected = this.props.selected;

        if (!selected)
            return null;

        let form = this.props.selected.get('props') || {},
            p = {
                form,
                layerProps: this.props.selectedLayer.get('props') || {},
                onChange: (name, val) => app.perform('editorQueueSave', {
                    form: {...form, [name]: val},
                    selected
                })
            };

        return (
            <div style={app.theme('gwc.plugin.gbd_digitize.form')}>
                {
                    selected.get('featureID') ?
                        <FeatureForm {...p} /> :
                        <LayerForm {...p} />
                }
            </div>
        )
    }
}


export default Form;
