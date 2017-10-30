import React from 'react';
import Drawer from 'material-ui/Drawer';


class VerticalDrawer extends Drawer {
    getStyles(){
        var y = this.state.open ? 0 : -1 * (window.innerHeight + 10);

        var superStyle = super.getStyles();
        superStyle.root.transform = 'translate(0,' + y + 'px)';
        return superStyle;
    }
}

export default VerticalDrawer;
