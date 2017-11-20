import React from 'react';

import app from 'app';

import toolbar from './toolbar';
import sidebar from './sidebar';
import statusbar from './statusbar';
import altbar from './altbar';
import overlay from './overlay';

class Plugin extends app.Plugin {
    init() {
        this.plugins = [
            new toolbar.Plugin,
            new sidebar.Plugin,
            new statusbar.Plugin,
        ];
        this.plugins.forEach(p => p.init());
    }
}

export default {
    Plugin,
    Toolbar: toolbar.Toolbar,
    Sidebar: sidebar.Sidebar,
    Statusbar: statusbar.Statusbar,
    Altbar: altbar.Altbar,
    Overlay: overlay.Overlay,
}
