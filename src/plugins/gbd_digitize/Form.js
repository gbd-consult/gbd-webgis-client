import React from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';

import _ from 'lodash';

import app from 'app';
import ol from 'ol-all';

import ColorPicker from 'components/ColorPicker';

const SAVE_DELAY = 1000;

function change(name, val) {
    app.update('editorForm', {[name]: val});
    _.debounce(() => app.perform('editorFormSave'), SAVE_DELAY)();
}

class Field extends React.Component {
    render() {
        return (
            <TextField
                id={'editor_' + this.props.name}
                fullWidth={true}
                hintText={this.props.hintText}
                value={this.props.editorForm[this.props.name] || ''}
                onChange={(evt, val) => change(this.props.name, val)}
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
                value={this.props.editorForm[this.props.name] || ''}
                onChange={(evt, key, val) => change(this.props.name, val)}
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
                value={this.props.editorForm[this.props.name] || ''}
                onChange={(evt, val) => change(this.props.name, val)}
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

class LayerForm extends React.Component {
    render() {
        return (
            <div>
                <Field name={'label'} hintText={__("gwc.plugin.gbd_digitize.label")} {...this.props} />
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <h5>{__("gwc.plugin.gbd_digitize.fill")}</h5>
                    <Color name={'fillColor'} {...this.props} />
                    <h5>{__("gwc.plugin.gbd_digitize.stroke")}</h5>
                    <Color name={'strokeColor'} {...this.props} />
                </div>
            </div>
        );
    }
}

class FeatureForm extends React.Component {
    render() {
        return (
            <div>
                <Field name={'label'} hintText={__("gwc.plugin.gbd_digitize.label")} {...this.props} />
            </div>
        );
    }
}

class Form extends React.Component {
    render() {
        if (!this.props.selected)
            return null;

        return (
            <div style={app.theme('gwc.plugin.gbd_digitize.form')}>
                {
                    this.props.selected.get('featureID') ? <FeatureForm {...this.props}/> : <LayerForm {...this.props} />
                }
            </div>
        )
    }
}


export default Form;
