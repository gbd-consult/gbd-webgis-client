/// example application showing Hamburg ALKIS data

module.exports = {

    // application language
    lang: 'de',

    // application title
    title: 'Hamburg ALKIS',

    // where to find the runtime config
    configURL: '/hamburg.runtime.json',

    // plugins to include
    plugins: [
        'map', 'ui',
        'details', 'layers', 'marker', 'qgis2',
        'search_alkis',
        'search_nominatim',
        'identify', 'selection',
        'position', 'scalebar', 'rotation',
        'zoom', 'measure'
    ],

    // initial state of the app
    initState: `
            sidebarVisible: false,
            sidebarActivePanel: 'layers',
            appWaiting: false,
            toolbarVisible: true,
            detailsContent: 'hey!'
        `,

    // application theme, use colors... for mui colors
    theme: `
            palette: {
                primary1Color: "#0086C9",
                primary2Color: "#005F9D",
                primary3Color: colors.grey400,
                accent1Color: "#B1CA34",
                accent2Color: colors.grey100,
                accent3Color: colors.grey500,
            }
        `,

    // application ui (must be valid JSX)
    ui: `
        <ui.Sidebar>
            <details.Panel key="details" title="Info" />
            <layers.Panel key="layers" title="Layers" />
        </ui.Sidebar>
        <ui.Toolbar>
            <zoom.MinusButton />
            <zoom.PlusButton />
            <zoom.BoxButton />
            <identify.Button />
            <measure.Button />
            <qgis2.PrintButton />
        </ui.Toolbar>
        <ui.Statusbar>
            <position.Control />
            <scalebar.Control />
        </ui.Statusbar>
        <ui.Searchbox />

    `
};


