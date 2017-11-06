/// features editor

module.exports = {

    lang: 'en',
    title: 'editor',
    configURL: '/editor.runtime.json',
    plugins: [
        'map', 'ui',
        'position', 'scalebar', 'layers',
        'editor'
    ],
    initState: `
            sidebarVisible: true,
            sidebarActivePanel: 'layers',
            
        `,

    ui: `
        <ui.Statusbar>
            <position.Control />
            <scalebar.Control />
        </ui.Statusbar>
        <ui.Sidebar>
                <editor.FeatureEditor key="FeatureEditor" />
                <editor.LayerEditor key="LayerEditor" />
                <layers.Panel key="layers" />
        </ui.Sidebar>
        
    `,


};


