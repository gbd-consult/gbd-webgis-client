import React from 'react';

import app from 'app';

const minSize = 50;

class Plugin extends app.Plugin {
}

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

        app.set({overlayBounds: el.getBoundingClientRect()});
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

        let res = app.map().getView().getResolution();

        let w = this.props.overlayWidth / res | 0;
        let h = this.props.overlayHeight / res | 0;

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
                {/*<div onMouseDown={e => this.startDrag()} style={{left: -p, top: -p, ...hstyle}}/>*/}
                {/*<div onMouseDown={e => this.startDrag()} style={{right: -p, top: -p, ...hstyle}}/>*/}
                {/*<div onMouseDown={e => this.startDrag()} style={{left: -p, bottom: -p, ...hstyle}}/>*/}
                {/*<div onMouseDown={e => this.startDrag()} style={{right: -p, bottom: -p, ...hstyle}}/>*/}
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


