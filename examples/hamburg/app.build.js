/// example application showing Hamburg ALKIS data

module.exports = {

    // application language
    lang: 'de',

    // application title
    title: 'Hamburg ALKIS',

    // in dev mode, where to find the runtime config
    devConfig: './runtime.json',

    // plugins to include
    plugins: [
        'map', 'ui', 'search',
        'details', 'layers', 'marker', 'qgis2',
        'search_alkis',
        'search_nominatim',
        'identify', 'selection',
        'position', 'scalebar', 'rotation',
        'zoom', 'measure'
    ],

    // initial state of the app
    initState: {
        sidebarVisible: false,
        sidebarActivePanel: 'layers',
        overlayVisible: false,
        appWaiting: false,
        toolbarVisible: true,
    },

    theme: require('./theme.js'),

    // application ui (must be valid JSX)
    ui: `
        <ui.Toolbar>
            <zoom.MinusButton/>
            <zoom.PlusButton/>
            <zoom.BoxButton desktopOnly />
            <identify.Button/>
            <measure.Button/>
            <qgis2.PrintButton/>
        </ui.Toolbar>
        <ui.Sidebar>
            <layers.Panel key="layers" title="Layers" icon="layers" />
            <details.Panel key="details" title="Info" icon="list" />
            <search.Panel key="search" title="Suche" icon="search" mobileOnly />
        </ui.Sidebar>
        <ui.Statusbar>
            <position.Control />
            <scalebar.Control />
            <ui.Statusbar.Widgets.Flex/>
            <ui.Statusbar.Widgets.Link target="help.html" mode="popup" text="Hilfe" />
            <ui.Statusbar.Widgets.Link target="terms.html" mode="popup" text="Nutzungsbedingungen" />
            <ui.Statusbar.Widgets.Link mode="popover" text="&copy;">&copy; OpenStreetMaps</ui.Statusbar.Widgets.Link>
            <ui.Statusbar.Widgets.Link mode="popover" 
                text={<img src="http://gbdclient.gbd-consult.de/gbd-logo.png" width={12} height={12} />}/>
        </ui.Statusbar>
        <ui.Altbar>
            <search.Box desktopOnly />
        </ui.Altbar>
    `
};


/*

 */