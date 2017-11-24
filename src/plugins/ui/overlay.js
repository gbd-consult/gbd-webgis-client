import React from 'react';

import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import {Toolbar} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import {SMALL, MEDIUM, LARGE} from 'material-ui/utils/withWidth';

import app from 'app';
import helpers from './helpers';

const minSize = 50;

class Overlay extends React.Component {

    updateSize(w, h) {
        if (this.props.overlayRatio)
            h = w / this.props.overlayRatio;

        w = Math.max(w, minSize);
        h = Math.max(h, minSize);

        app.set({
            overlayWidth: w,
            overlayHeight: h
        });
    }

    updateExtent(el) {
        if (!el)
            return;

        let map = app.map(),
            bounds = el.getBoundingClientRect(),
            extent = [].concat(
                map.getCoordinateFromPixel([bounds.left, bounds.top]),
                map.getCoordinateFromPixel([bounds.right, bounds.bottom])
            );

        app.set({overlayExtent: extent});
    }

    startDrag() {

        let mouseMove = (e) => {
            this.updateSize(
                Math.abs(window.innerWidth / 2 - e.clientX) * 2,
                Math.abs(window.innerHeight / 2 - e.clientY) * 2);
            e.preventDefault();
        };

        let mouseUp = (e) => {
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        };

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
    }

    render() {
        if (!this.props.overlayVisible)
            return null;

        let w = this.props.overlayWidth;
        let h = this.props.overlayRatio ?
            w / this.props.overlayRatio :
            this.props.overlayHeight;

        let style = {
            ...app.theme('gwc.ui.overlay.box'),
            marginLeft: -(w / 2),
            marginTop: -(h / 2),
            width: w,
            height: h
        };

        let hstyle = app.theme('gwc.ui.overlay.handle');
        let p = hstyle.width >> 1;

        return (
            <div style={style} ref={el => this.updateExtent(el)}>
                <div onMouseDown={e => this.startDrag()} style={{left: -p, top: -p, ...hstyle}}/>
                <div onMouseDown={e => this.startDrag()} style={{right: -p, top: -p, ...hstyle}}/>
                <div onMouseDown={e => this.startDrag()} style={{left: -p, bottom: -p, ...hstyle}}/>
                <div onMouseDown={e => this.startDrag()} style={{right: -p, bottom: -p, ...hstyle}}/>
            </div>
        )
    }
}

export default {
    Plugin,
    Overlay: app.connect(Overlay,
        ['appWidth', 'appIsMobile',
            'overlayVisible', 'overlayWidth', 'overlayHeight', 'overlayRatio'])
}


