import React from 'react';

import app from 'app';

import toolbar from './toolbar';
import sidebar from './sidebar';
import statusbar from './statusbar';
import searchbox from './searchbox';

class Plugin extends app.Plugin {
    init() {
        this.plugins = [
            new toolbar.Plugin,
            new sidebar.Plugin,
            new statusbar.Plugin,
            new searchbox.Plugin
        ];
        this.plugins.forEach(p => p.init());
    }
}


export default {
    Plugin,
    Toolbar: toolbar.Toolbar,
    Sidebar: sidebar.Sidebar,
    Statusbar: statusbar.Statusbar,
    Searchbox: searchbox.Searchbox
}
