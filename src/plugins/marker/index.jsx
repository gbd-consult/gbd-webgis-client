import app from 'app';
import ol from 'ol-all';

const LAYER_NAME = 'markerLayer';

export class Plugin extends app.Component {

    constructor(props) {
        super(props);

        this.style = new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 0, 0, 0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: '#fffa27',
                lineDash: [3, 3],
                width: 1
            }),
        });

        this.selectedStyle = new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 0, 0, 0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: '#fffa27',
                lineDash: [3, 3],
                width: 3
            }),
        });
    }

    getLayer() {
        for (let la of app.map().getLayers().getArray()) {
            if (la.get('name') === LAYER_NAME) {
                return la;
            }
        }
    }

    removeLayer() {
        let la = this.getLayer();
        if (la)
            app.map().removeLayer(la);
    }

    addlayer() {
        let la = this.getLayer();

        if (la)
            return la;

        la = new ol.layer.Vector({
            source: new ol.source.Vector({
                projection: app.config.str('map.crs.client')
            }),
            style: this.style
        });

        la.set('name', LAYER_NAME);
        app.map().addLayer(la);
        return la;
    }

    componentDidMount() {
        this.on('marker.set', opts => this.set(opts));
        this.on('marker.clear', () => this.clear());
    }

    onMapDown(evt) {
        let src = this.getLayer().getSource();

        for (let f of src.getFeatures()) {
            f.setStyle(null);
        }

        for (let f of src.getFeaturesAtCoordinate(evt.coordinate)) {
            f.setStyle(this.selectedStyle);
            if (f.get('info'))
                this.emit('infopanel.update', f.get('info'));
        }

        return false;
    }

    set(opts) {
        if (opts.point)
            opts.geometry = new ol.geom.Circle(opts.point, 10);

        let la = this.addlayer();
        la.getSource().addFeature(new ol.Feature(opts));

        if (opts.pan) {
            let extent = la.getSource().getExtent();
            console.log(extent);
            app.map().getView().fit(extent);
        }

        app.map().setMode('markerMode', 'help', [
            new ol.interaction.Pointer({
                handleDownEvent: evt => this.onMapDown(evt)
            }),
            new ol.interaction.DragPan(),
            new ol.interaction.MouseWheelZoom()
        ]);

    }

    clear() {
        this.removeLayer();
    }


}