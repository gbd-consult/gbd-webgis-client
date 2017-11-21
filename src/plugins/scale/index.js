import React from 'react';

import app from 'app';
import * as sb from 'components/StatusbarWidgets';

class Plugin extends app.Plugin {
}

class Control extends React.Component {

    render() {
        let scales = app.map().getScales(),
            level = app.map().getScaleLevel();

        if (!scales || isNaN(level))
            return null;

        let len = scales.length - 1;

        return (
            <sb.Group>
                <sb.Label
                    value='1:'/>
                <sb.Input
                    width={50}
                    onChange={() => 0}
                    value={scales[level]}/>

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

class Bar extends React.Component {

    style() {
        return {
            height: 5,
            borderStyle: 'solid',
            borderColor: app.theme().gbd.ui.statusbar.label.color,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderTopWidth: 0,
        }
    }

    round(m) {
        let s = Math.pow(10, Math.floor(Math.log10(m))),
            t = Math.floor(m / s);
        if (t > 5)
            t = 5;
        else if (t > 2)
            t = 2;
        return t * s;
    }

    render() {
        let res = this.props.mapResolution;

        if (!res)
            return null;


        let width = app.theme().gbd.plugin.scale.barWidth;
        let m = this.round(res * width);
        let label = (m >= 1000) ? Math.floor(m / 1000) + 'km' : m + 'm';

        let s = this.style();
        s.width = Math.round(m / res);

        return (
            <sb.Group>
                <sb.Label
                    value={label}/>
                <div style={s}/>
            </sb.Group>
        );
    }
}

export default {
    Plugin,
    Control: app.connect(Control, ['mapResolution']),
    Bar: app.connect(Bar, ['mapResolution']),
};

