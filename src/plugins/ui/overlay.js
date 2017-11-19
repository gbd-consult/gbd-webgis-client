import React from 'react';

import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import {Toolbar} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import {SMALL, MEDIUM, LARGE} from 'material-ui/utils/withWidth';

import app from 'app';
import zindex from './zindex';

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

    css() {
        let th = app.theme().gbd.ui.overlay;

        let w = this.props.overlayWidth;
        let h = this.props.overlayRatio ?
            w / this.props.overlayRatio :
            this.props.overlayHeight;

        return {
            container: {
                position: 'absolute',
                left: '50%',
                top: '50%',
                marginLeft: -(w / 2),
                marginTop: -(h / 2),
                width: w,
                height: h,
                boxShadow: '0 0 0 4000px rgba(0,0,0,0.7)',
                pointerEvents: 'none',
                transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                borderWidth: th.borderWidth,
                borderColor: th.borderColor,
                borderStyle: 'solid',
            },
            handle: {
                position: 'absolute',
                width: 16,
                height: 16,
                pointerEvents: 'auto',
                cursor: 'pointer',
                borderRadius: '50%',
                backgroundColor: th.borderColor,
                zIndex: zindex.overlayHandles
            }
        }
    }

    render() {
        if (!this.props.overlayVisible)
            return null;

        let css = this.css(),
            p = css.handle.width >> 1;

        return (
            <div style={css.container} ref={el => this.updateExtent(el)}>
                <div onMouseDown={e => this.startDrag()} style={{left: -p, top: -p, ...css.handle}}/>
                <div onMouseDown={e => this.startDrag()} style={{right: -p, top: -p, ...css.handle}}/>
                <div onMouseDown={e => this.startDrag()} style={{left: -p, bottom: -p, ...css.handle}}/>
                <div onMouseDown={e => this.startDrag()} style={{right: -p, bottom: -p, ...css.handle}}/>
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


