import React from 'react';
import IconButton from 'material-ui/IconButton';

import app from 'app';

import SimpleButton from 'components/SimpleButton';

class Toolbar extends React.Component {
    render() {

        let style = app.theme('gwc.plugin.gbd_digitize.toolButton'),
            s = {
                add: style.normal,
                pick: style.normal,
                labels: app.get('editorShowLabels') ? style.active : style.normal
            };

        s.modify = s.point = s.line = s.polygon = s.delete = style.normal;

        switch (this.props.mapMode) {
            case 'editorPick':
                s.pick = style.active;
                break;
            case 'editorModify':
                s.modify = style.active;
                break;
            case 'editorDrawPoint':
                s.point = style.active;
                break;
            case 'editorDrawLineString':
                s.line = style.active;
                break;
            case 'editorDrawPolygon':
                s.polygon = style.active;
                break;
        }

        if (!this.props.editorSelectedID)
            s.modify = s.point = s.line = s.polygon = s.delete = style.disabled;

        return (
            <div style={app.theme('gwc.plugin.gbd_digitize.toolbar')}>

                <IconButton
                    style={s.add}
                    tooltip={__("gwc.plugin.gbd_digitize.addButton")}
                    tooltipPosition='top-right'
                    tooltipStyles={{position: 'absolute'}}
                    onClick={() => app.perform('editorAddLayer')}
                >
                    <SimpleButton icon='add'/>
                </IconButton>

                <div style={{flex: 1}}/>

                <IconButton
                    style={s.pick}
                    tooltip={__("gwc.plugin.gbd_digitize.pickButton")}
                    tooltipPosition='top-left'
                    onClick={() => app.perform('editorPick')}
                >
                    <SimpleButton icon='call_made'/>
                </IconButton>

                <IconButton
                    style={s.modify}
                    tooltip={__("gwc.plugin.gbd_digitize.modifyButton")}
                    tooltipPosition='top-left'
                    onClick={() => app.perform('editorModify')}
                >
                    <SimpleButton icon='edit'/>
                </IconButton>

                <IconButton
                    style={s.point}
                    tooltip={__("gwc.plugin.gbd_digitize.pointButton")}
                    tooltipPosition='top-left'
                    onClick={() => app.perform('editorDraw', {type: 'Point'})}
                >
                    <SimpleButton icon='bubble_chart'/>
                </IconButton>

                <IconButton
                    style={s.line}
                    tooltip={__("gwc.plugin.gbd_digitize.lineButton")}
                    tooltipPosition='top-left'
                    onClick={() => app.perform('editorDraw', {type: 'LineString'})}
                >
                    <SimpleButton icon='timeline'/>
                </IconButton>

                <IconButton
                    style={s.polygon}
                    tooltip={__("gwc.plugin.gbd_digitize.polygonButton")}
                    tooltipPosition='top-left'
                    onClick={() => app.perform('editorDraw', {type: 'Polygon'})}
                >
                    <SimpleButton icon='details'/>
                </IconButton>

                <IconButton
                    style={s.labels}
                    tooltip={__("gwc.plugin.gbd_digitize.labelsButton")}
                    tooltipPosition='top-left'
                    onClick={() => app.perform('editorToggleLabels')}
                >
                    <SimpleButton icon='text_format'/>
                </IconButton>

            </div>
        );
    }
}


export default Toolbar;
