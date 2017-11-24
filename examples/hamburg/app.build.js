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
        'position', 'scale', 'rotation',
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
            <zoom.PlusButton/>
            <zoom.MinusButton/>
            <zoom.FullButton/>
            <zoom.BoxButton desktopOnly/>
            <identify.Button/>
            <measure.Button/>
            <qgis2.PrintButton desktopOnly/>
        </ui.Toolbar>
        <ui.Sidebar>
            <layers.Panel key="layers" title="Layers" icon="layers" />
            <details.Panel key="details" title="Info" icon="toc" />
            <search.Panel key="search" title="Suche" icon="search" mobileOnly />
        </ui.Sidebar>
        <ui.Statusbar>
            <position.Control desktopOnly/>
            <scale.Control desktopOnly/>
            <scale.Bar />
            <ui.Statusbar.Widget.Flex />
            <ui.Statusbar.Widget.Link href="help.html" mode="popup" text="Hilfe" />
            <ui.Statusbar.Widget.Separator />
            <ui.Statusbar.Widget.Link href="terms.html" mode="popup" text="Nutzungsbedingungen" />
            <ui.Statusbar.Widget.Separator />
            <ui.Statusbar.Widget.Link href="about.html" mode="popup"  
                text={<img 
                    src="http://gbdclient.gbd-consult.de/gbd-logo.png" 
                    style={{width: 12, height: 12, marginRight: 8, verticalAlign: 'middle'}} 
                    />}
            />
        </ui.Statusbar>
        <ui.Altbar>
            <search.Box desktopOnly />
        </ui.Altbar>
    `
};
