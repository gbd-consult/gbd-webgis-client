import React from 'react';

import app from 'app';
import * as sb from 'components/StatusbarWidgets';

class Plugin extends app.Plugin {
}

class Control extends React.Component {

    prepare(value) {
        let scales = app.map().getScales();

        value = Math.floor(Number(value) || 0);
        if(value > scales[0])
            return scales[0];
        if(value < scales[scales.length - 1])
            return scales[scales.length - 1];
        return value;
    }

    update(value) {
        let scale = app.map().getScale(),
            val = this.prepare(value);
        if(val === scale)
            this.forceUpdate();
        else
            app.perform('mapSetScale', {scale: val});
    }

    render() {
        let map = app.map(),
            scales = map.getScales(),
            scale = map.getScale(),
            level = map.getScaleLevel();

        if (isNaN(level))
            return null;

        let len = scales.length - 1;

        return (
            <sb.Group>
                <sb.Label
                    value={__("gwc.plugin.scale.controlLabel")}/>
                <sb.Input
                    width={50}
                    onChange={(evt, value) => this.update(value)}
                    changeOnEnter
                    step={1}
                    value={scale}/>

                <sb.SmallSlider
                    min={0}
                    max={len}
                    step={1}
                    value={len - level}
                    onChange={(evt, value) => app.perform('mapSetScaleLevel', {level: len - value})}
                />
            </sb.Group>
        );
    }
}

class Indicator extends React.Component {

    round(m) {
        let s = Math.pow(10, Math.floor(Math.log10(m))),
            t = Math.floor(m / s);
        if (t > 5)
            t = 5;
        else if (t > 2)
            t = 2;
        return t * s;
    }

    compRender(width, label) {
        let barStyle = {
            ...app.theme('gwc.plugin.scale.indicator.bar'),
            width
        };

        return (
            <div style={app.theme('gwc.plugin.scale.indicator.container')}>
                <div style={app.theme('gwc.plugin.scale.indicator.label')}>{label}</div>
                <div style={barStyle}/>
            </div>
        );
    }

    render() {
        let res = this.props.mapResolution;

        if (!res)
            return null;

        let w = this.props.width || 200,
            m = this.round(res * w),
            width = Math.round(m / res),
            label = (m >= 1000) ? Math.floor(m / 1000) + 'km' : m + 'm';

        return this.compRender(width, label);
    }
}

class StatusbarIndicator extends Indicator {

    compRender(width, label) {
        let barStyle = {
            ...app.theme('gwc.plugin.scale.statusBarIndicator.bar'),
            width
        };

        return (
            <sb.Group>
                <sb.Label value={label}/>
                <div style={barStyle}/>
            </sb.Group>
        );
    }
}


export default {
    Plugin,
    Control: app.connect(Control, ['mapResolution']),
    Indicator: app.connect(Indicator, ['mapResolution']),
    StatusbarIndicator: app.connect(StatusbarIndicator, ['mapResolution']),
};

