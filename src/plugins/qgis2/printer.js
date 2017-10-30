import React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';

import app from 'app';
import ol from 'ol-all';

import wms from './wms';
import layers from './layers';

let mapMode = 'qgisPrintOverlay';

let rad2deg = a => Math.floor(a / (Math.PI / 180));

async function initOverlay() {
    let templates = await wms.printTemplates();

    app.set({
        sidebarVisible: false,
        qgisPrintOverlaySize: [
            templates[0].maps[0].width,
            templates[0].maps[0].height,
        ],
        qgisPrintOverlayURL: null
    });

    app.perform('mapMode', {
        name: mapMode,
        cursor: 'crosshair',
        interactions: [
            new ol.interaction.DragPan(),
            new ol.interaction.MouseWheelZoom()
        ]
    });
}

function updateURL(mask) {

    // rely on map viewport being at (0,0)

    let map = app.map(),
        bounds = mask.getBoundingClientRect(),
        extent = [].concat(
            map.getCoordinateFromPixel([bounds.left, bounds.top]),
            map.getCoordinateFromPixel([bounds.right, bounds.bottom])
        ),
        scale = map.getScale(),
        rotation = rad2deg(map.getView().getRotation()),
        layerNames = layers.visibleNames();

    app.set({
        qgisPrintOverlayURL: wms.printURL({layerNames, extent, scale, rotation})
    });

}


class Overlay extends React.Component {

    onPrintClick() {
        updateURL(document.querySelector('#PrintOverlayMask'));
    }

    onCancelClick() {
        app.perform('mapDefaultMode');
    }


    resultDialog() {
        let url = this.props.qgisPrintOverlayURL;

        if (!url)
            return null;

        let actions = [
            <IconButton onClick={() => this.onCancelClick()}>
                <FontIcon className="material-icons">close</FontIcon>
            </IconButton>
        ];

        return (
            <Dialog
                open={true}
                modal={false}
                contentStyle={{
                    width: '90%'
                }}
                actions={actions}
            >
                <iframe
                    src={url}
                    style={{
                        width: '95%',
                        height: '70vh',
                    }}
                />
            </Dialog>

        );
    }

    render() {
        let [width, height] = this.props.qgisPrintOverlaySize;
        return (
            <div>
                <div id="PrintOverlayMask" style={{
                    position: 'fixed',
                    top: 50,
                    left: '50%',
                    marginLeft: -(width >> 1),
                    width: width,
                    height: height,
                    border: '3px dotted black',
                    pointerEvents: 'none',
                    boxShadow: '0 0 0 50px rgba(255,255,255,0.9)'
                }}/>

                <div style={{
                    position: 'fixed',
                    top: height + 60,
                    left: '50%',
                    marginLeft: -(width >> 1),
                    width: width,
                }}>
                    <IconButton onClick={() => this.onPrintClick()}>
                        <FontIcon className="material-icons">print</FontIcon>
                    </IconButton>

                    <IconButton onClick={() => this.onCancelClick()}>
                        <FontIcon className="material-icons">close</FontIcon>
                    </IconButton>

                </div>

                {this.resultDialog()}

            </div>
        );
    }
}

export default {
    mapMode,
    initOverlay,
    Overlay: app.connect(Overlay, ['qgisPrintOverlaySize', 'qgisPrintOverlayURL'])
}

