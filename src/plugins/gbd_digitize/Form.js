import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import _ from 'lodash';

import app from 'app';
import ol from 'ol-all';

import ColorPicker from 'components/ColorPicker';
import Grid from 'components/Grid';


class Field extends React.Component {
    render() {
        return (
            <TextField
                id={this.props.id}
                fullWidth={true}
                hintText={this.props.hintText}
                value={this.props.value || ''}
                onChange={(evt, val) => this.props.onChange(val)}
            />
        );
    }
}

class Color extends React.Component {
    render() {
        return (
            <ColorPicker
                id={this.props.id}
                hintText={this.props.hintText}
                value={this.props.value || ''}
                onChange={(evt, val) => this.props.onChange(val)}
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

class Footer extends React.Component {
    render() {
        return (

            <div style={{paddingTop: 16, textAlign: 'right'}}>
                <RaisedButton
                    label={__("gwc.plugin.gbd_digitize.saveButton")}
                    primary={true}
                    onClick={this.props.onSubmit}
                />
                <span style={{paddingLeft: 6}}/>
                <RaisedButton
                    secondary={true}
                    label={__("gwc.plugin.gbd_digitize.deleteButton")}
                    onClick={this.props.onDelete}
                />
            </div>
        );
    }
}

class LayerForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getState(props);
    }

    componentWillReceiveProps(props) {
        this.setState(this.getState(props));
    }

    getState(props) {
        let layer = props.selectedObject,
            layerProps = layer.get('props');

        let attributes = layerProps.attributes.map(a => ({
            key: a.position,
            values: [a.name],
            editable: [true]
        })).sort((x, y) => x.key - y.key);

        return {
            layerID: layer.get('layerID'),
            name: layerProps['name'] || '',
            attributes,
            maxPos: _.max(attributes, 'key') || 0,
            fillColor: layerProps.style.fillColor,
            strokeColor: layerProps.style.strokeColor,
        }
    }

    addAttribute() {
        let pos = this.state.maxPos + 1;
        this.setState({
            maxPos: pos,
            attributes: this.state.attributes.concat({
                key: pos,
                values: [''],
                editable: [true]
            })
        });
    }

    changeAttribute(r, val) {
        this.setState({
            attributes: this.state.attributes.map(a => a.key !== r ? a : {
                key: a.key,
                values: [val],
                editable: [true]
            })
        });
    }

    removeAttribute(r) {
        this.setState({
            attributes: this.state.attributes.filter(a => a.key !== r)
        });
    }

    actionSubmit() {
        let props = {
            name: this.state.name,
            style: {
                fillColor: this.state.fillColor,
                strokeColor: this.state.strokeColor
            },
            attributes: this.state.attributes.map(a => ({
                position: a.key,
                name: a.values[0]
            }))
        };
        app.perform('editorUpdateLayer', {layerID: this.state.layerID, props});
    }

    actionDelete() {
        app.perform('editorDeleteLayer', {layerID: this.state.layerID});
    }

    render() {

        return (
            <div>
                <Field
                    id={'editor_name'}
                    value={this.state.name}
                    hintText={__("gwc.plugin.gbd_digitize.label")}
                    onChange={name => this.setState({name})}
                />

                <div style={{display: 'flex', alignItems: 'center'}}>
                    <h5>{__("gwc.plugin.gbd_digitize.fill")}</h5>
                    <Color
                        id={'editor_fill'}
                        value={this.state.fillColor}
                        onChange={fillColor => this.setState({fillColor})}
                    />
                    <h5>{__("gwc.plugin.gbd_digitize.stroke")}</h5>
                    <Color
                        id={'editor_stroke'}
                        value={this.state.strokeColor}
                        onChange={strokeColor => this.setState({strokeColor})}
                    />
                </div>

                <div>
                    <h5>{__("gwc.plugin.gbd_digitize.attrTitle")}</h5>
                    <Grid
                        data={this.state.attributes}
                        onAddRow={() => this.addAttribute()}
                        onDeleteRow={r => this.removeAttribute(r)}
                        onChange={(r, c, val) => this.changeAttribute(r, val)}
                    />
                </div>

                <Footer
                    onSubmit={() => this.actionSubmit()}
                    onDelete={() => this.actionDelete()}
                />
            </div>
        );
    }
}

class FeatureForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getState(props);
    }

    componentWillReceiveProps(props) {
        this.setState(this.getState(props));
    }

    getState(props) {
        let feature = props.selectedObject,
            featureProps = feature.get('props'),
            layer = props.selectedLayer,
            layerProps = layer.get('props');

        let attributes = layerProps.attributes.map(a => ({
            key: a.position,
            values: [a.name, featureProps[a.name] || ''],
            editable: [false, true]
        })).sort((x, y) => x.key - y.key);

        return {
            featureID: feature.get('featureID'),
            name: featureProps['name'] || '',
            attributes
        }
    }

    changeAttribute(r, val) {
        this.setState({
            attributes: this.state.attributes.map(a => a.key !== r ? a : {
                key: a.key,
                values: [a.values[0], val],
                editable: [false, true]
            })
        });
    }

    actionSubmit() {
        let props = {
            name: this.state.name,
        };

        this.state.attributes.forEach(a =>
            props[a.values[0]] = a.values[1]);

        app.perform('editorUpdateFeature', {featureID: this.state.featureID, props});
    }


    actionDelete() {
        app.perform('editorDeleteFeature', {featureID: this.state.featureID});
    }


    render() {
        return (
            <div>
                <div>
                    <Field
                        id={'editor_name'}
                        value={this.state.name}
                        hintText={__("gwc.plugin.gbd_digitize.label")}
                        onChange={name => this.setState({name})}
                    />
                </div>

                {!!this.state.attributes.length && <div>
                    <h5>{__("gwc.plugin.gbd_digitize.attrTitle")}</h5>
                    <Grid
                        data={this.state.attributes}
                        onChange={(r, c, val) => this.changeAttribute(r, val)}
                    />
                </div>}

                <Footer
                    onSubmit={() => this.actionSubmit()}
                    onDelete={() => this.actionDelete()}
                />

            </div>
        );
    }
}

class Form extends React.Component {
    render() {
        if (!this.props.selectedObject)
            return null;

        return (
            <div style={app.theme('gwc.plugin.gbd_digitize.form')}>
                {
                    this.props.selectedObject.get('featureID') ?
                        <FeatureForm {...this.props} /> :
                        <LayerForm {...this.props} />
                }
            </div>
        )
    }
}


export default Form;
