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
        'attribution',
        'map', 'ui', 'search',
        'details', 'layers', 'marker', 'qgis2',
        'identify',
        'position', 'scale', 'rotation',
        'zoom', 'measure'
    ],

    // initial state of the app
    initState: {
        sidebarVisible: false,
        overlayVisible: false,
        appWaiting: false,
        toolbarVisible: true,
    },

    theme: require('./theme.js'),

    // application ui (must be valid JSX)
    ui: `
        
        <attribution.Bar/>

        <ui.Toolbar>
            <zoom.PlusButton/>
            <zoom.MinusButton/>
            <zoom.FullButton/>
            <zoom.BoxButton desktopOnly/>
            
            <identify.Button icon="info" desktopOnly />
            <identify.Button icon="info" desktopOnly hover topOnly popup/>

            <identify.Button icon="info" mobileOnly topOnly popup/>

            <measure.Button/>
            <qgis2.PrintButton desktopOnly/>
        </ui.Toolbar>
        
        <ui.Sidebar>
            <layers.Panel key="layers" title="Layers" icon="layers" />
            <details.Panel key="details" title="Info" icon="info" desktopOnly />
            <search.Panel key="search" title="Suche" icon="search" mobileOnly />
        </ui.Sidebar>

        <scale.Indicator />
        <marker.Popup />
        
        <ui.Statusbar>
            <position.Control desktopOnly/>
            <scale.Control desktopOnly/>
            <rotation.Control desktopOnly/>
            <ui.Statusbar.Widget.Flex />
            <ui.Statusbar.Widget.Link href="http://gbdclient.gbd-consult.de/lorem.html" target="popup" text="Hilfe" />
            <ui.Statusbar.Widget.Separator />
            <ui.Statusbar.Widget.Link href="http://gbdclient.gbd-consult.de/lorem.html" target="popup" text="AGB" />
            <ui.Statusbar.Widget.Separator />
            <ui.Statusbar.Widget.Link href="http://gbd-consult.de" target="blank"  
                text={<img 
                    src="http://gbdclient.gbd-consult.de/gbd-globe.svg" 
                    style={{width: 14, height: 14, marginRight: 6, verticalAlign: 'middle'}} 
                    />}
            />
        </ui.Statusbar>
        
        <ui.Altbar>
            <search.Box desktopOnly />
        </ui.Altbar>
    `
};
